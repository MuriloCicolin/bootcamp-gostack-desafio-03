import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipient = await Recipient.findAll();

    return res.json(recipient);
  }

  async show(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findOne({
      where: {
        id,
      },
    });
    if (!recipient) {
      return res.status(401).json({ error: 'Recipient not found!' });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, street, number, state, city, cep } = await Recipient.create(
      req.body
    );

    const recipients = {
      name,
      street,
      number,
      state,
      city,
      cep,
    };

    return res.json(recipients);
  }

  async update(req, res) {
    const { id } = req.params;

    const recipients = await Recipient.findByPk(id);

    const { name, street, number, state, city, cep } = await recipients.update(
      req.body
    );

    return res.json({
      recipients: {
        id,
        name,
        street,
        number,
        state,
        city,
        cep,
      },
    });
  }
}

export default new RecipientController();
