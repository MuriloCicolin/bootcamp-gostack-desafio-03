import * as Yup from 'yup';
import { Op } from 'sequelize';
import Order from '../models/Order';
import DeliveryProblems from '../models/DeliveryProblems';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import CancellationMail from '../Jobs/CancellationMail';

class DeliveryProblemsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await DeliveryProblems.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        description: {
          [Op.ne]: null,
        },
      },
    });
    return res.json(problems);
  }

  async show(req, res) {
    const { delivery_id } = req.params;

    const deliveryProblem = await DeliveryProblems.findByPk(delivery_id);

    if (!deliveryProblem) {
      return res
        .status(401)
        .json({ error: 'Delivery with problem not exists' });
    }

    return res.json(deliveryProblem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { description } = req.body;
    const { delivery_id } = req.params;

    const delivery = await Order.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    const problems = await DeliveryProblems.create({
      description,
      delivery_id,
    });

    return res.json(problems);
  }

  async delete(req, res) {
    const { delivery_id } = req.params;

    const deliveryProblem = await DeliveryProblems.findByPk(delivery_id);

    if (!deliveryProblem) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    const order = await Order.findByPk(deliveryProblem.delivery_id);

    const deliveryman = await Deliveryman.findByPk(order.deliveryman_id);

    await deliveryProblem.update({
      canceled_at: new Date(),
    });

    deliveryProblem.save();

    await Queue.add(CancellationMail.key, {
      order,
      deliveryman,
    });

    return res.send(deliveryProblem);
  }
}

export default new DeliveryProblemsController();
