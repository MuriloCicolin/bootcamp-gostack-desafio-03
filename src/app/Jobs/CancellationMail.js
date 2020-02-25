import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, order } = data;

    Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Novo Cancelamento',
      template: 'cancellation',
      context: {
        deliveryman: deliveryman.name,
        order: order.product,
      },
    });
  }
}

export default new CancellationMail();
