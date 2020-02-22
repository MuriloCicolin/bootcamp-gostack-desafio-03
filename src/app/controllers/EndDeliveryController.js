import { parseISO } from 'date-fns';
import * as Yup from 'Yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class EndDeliveryContrller {
  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const { end_date, signature_id } = req.body;
    const { deliveryman_id, delivery_id } = req.params;

    const delivery = await Order.findByPk(delivery_id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    const dateEnd = parseISO(end_date);

    await delivery.update({
      end_date: dateEnd,
      signature_id,
    });

    return res.json(delivery);
  }
}

export default new EndDeliveryContrller();
