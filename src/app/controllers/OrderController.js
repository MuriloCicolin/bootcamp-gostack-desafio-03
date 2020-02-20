import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Order from '../models/Order';
import Queue from '../../lib/Queue';
import OrderMail from '../Jobs/OrderMail';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['recipient_id', 'deliveryman_id', 'product'],
      include: [
        {
          model: Deliveryman,
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          attributes: ['name', 'street', 'number', 'cep', 'city', 'state'],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { deliveryman_id, recipient_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: ' Recipient not found' });
    }

    const orders = await Order.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    await Queue.add(OrderMail.key, {
      deliveryman,
      product,
    });

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;

    const { deliveryman_id, recipient_id, product } = req.body;

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    const recipient = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient not found' });
    }

    const orderExists = await Order.findByPk(id);

    if (!orderExists) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await orderExists.update(req.body);

    return res.json(orderExists);
  }

  async delete(req, res) {
    const { id } = req.params;

    const orderExists = await Order.findByPk(id);

    if (!orderExists) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await orderExists.destroy();

    return res.json();
  }
}

export default new OrderController();
