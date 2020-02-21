import {
  startOfDay,
  endOfDay,
  parseISO,
  getHours,
  isBefore,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class StartControllerDelivery {
  async update(req, res) {
    const { start_date } = req.body;
    const { deliveryman_id, delivery_id } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    const delivery = await Order.findByPk(delivery_id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    if (!start_date) {
      return res.status(401).json({ error: 'Start date must be completed' });
    }

    if (delivery.canceled_at) {
      return res.status(401).json({ error: 'Canceled date is not possible' });
    }

    const startDate = parseISO(start_date);

    const hourDate = getHours(startDate);

    if (!(isAfter(hourDate, 8) && isBefore(hourDate, 18))) {
      return res.status(401).json({
        error: 'It is only possible to withdraw from 8 am until 6 pm',
      });
    }

    const countDelivery = await Order.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(startDate), endOfDay(startDate)],
        },
      },
    });

    if (countDelivery.length >= 5) {
      return res.status(401).json({
        error: 'It is not possible to withdraw more than 5 times a day',
      });
    }

    await delivery.update(req.body);

    return res.json(countDelivery);
  }
}

export default new StartControllerDelivery();
