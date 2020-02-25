import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class OpenDeliveriesController {
  async show(req, res) {
    const { page = 1 } = req.query;
    const { deliverymanId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not exists!' });
    }

    const delivery = await Order.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: null,
      },
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'signature_id',
        'deliveryman_id',
        'recipient_id',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
      ],
    });

    return res.json(delivery);
  }
}

export default new OpenDeliveriesController();
