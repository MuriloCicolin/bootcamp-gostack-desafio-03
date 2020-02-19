import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverymen = await Deliveryman.findAll({
      attributes: ['name', 'email', 'avatar_id'],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'name', 'url'],
        },
      ],
    });

    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, avatar_id } = req.body;

    const deliveryman = await Deliveryman.findOne({ where: { email } });

    if (deliveryman) {
      return res
        .status(400)
        .json({ error: 'User already exists. Try another email' });
    }

    const deliverymen = await Deliveryman.create(req.body);

    return res.json(deliverymen);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { email } = req.body;
    const { id } = req.params;

    const user = await Deliveryman.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (email !== user.email) {
      const emailExists = await Deliveryman.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    await user.update(req.body);

    return res.json(user);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliverymen = await Deliveryman.findByPk(id);

    if (!deliverymen) {
      return res.status(400).json({ error: 'User not found' });
    }

    await deliverymen.destroy();

    return res.json();
  }
}

export default new DeliverymanController();
