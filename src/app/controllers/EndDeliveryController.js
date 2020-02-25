import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class EndDeliveryController {
  async update(req, res) {
    const { deliveryman_id, delivery_id } = req.params;

    const delivery = await Order.findByPk(delivery_id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    if (delivery.end_date < delivery.start_date) {
      return res.status(401).json({
        error: 'The delivery close date is greater than the start date',
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'You must send a signature picture' });
    }

    const { filename: path, originalname: name } = req.file;

    const file = await File.create({
      name,
      path,
    });

    await delivery.update({
      end_date: new Date(),
      signature_id: file.id,
    });

    return res.json(delivery);
  }
}

export default new EndDeliveryController();
