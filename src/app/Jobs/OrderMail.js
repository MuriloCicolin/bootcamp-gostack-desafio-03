import Mail from '../../lib/Mail';

class OrderMail {
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { deliveryman, product } = data;

    Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova Entrega',
      template: 'order',
      context: {
        deliveryman: deliveryman.name,
        product,
      },
    });
  }
}

export default new OrderMail();
