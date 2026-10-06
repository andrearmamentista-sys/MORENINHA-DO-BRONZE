import { Booking, StudioSettings, StaffMember } from '../types';

/**
 * Generates an affectionate, warm confirmation message for the client on WhatsApp.
 */
export function generateAffectionateClientConfirmationMessage(
  booking: Booking,
  studioSettings: StudioSettings
): string {
  const dateFormatted = booking.date.split('-').reverse().join('/');
  const firstName = booking.clientName.trim().split(' ')[0] || booking.clientName;
  const paymentText =
    booking.paymentMethod === 'local'
      ? 'Pagamento presencial no estúdio no dia do seu atendimento'
      : 'Pix antecipado';

  // If a custom template is defined, replace placeholders
  if (studioSettings.customClientMessageTemplate && studioSettings.customClientMessageTemplate.trim()) {
    return studioSettings.customClientMessageTemplate
      .replace(/{cliente}/g, booking.clientName)
      .replace(/{primeiro_nome}/g, firstName)
      .replace(/{servico}/g, booking.serviceTitle)
      .replace(/{data}/g, dateFormatted)
      .replace(/{horario}/g, booking.time)
      .replace(/{profissional}/g, booking.professionalName || 'Nossa Especialista')
      .replace(/{local}/g, `${studioSettings.address} · ${studioSettings.cityState}`)
      .replace(/{valor}/g, booking.total.toFixed(2).replace('.', ','))
      .replace(/{pagamento}/g, paymentText)
      .replace(/{estudio}/g, studioSettings.studioName);
  }

  // Default warm and affectionate message
  return (
    `✨🌸 *Oi, minha linda ${firstName}!* 🌸✨\n\n` +
    `Que alegria imensa ter você com a gente no *${studioSettings.studioName}*! Seu horário especial foi reservado com todo o amor e carinho do mundo! 🥰💖\n\n` +
    `📋 *Resumo do seu atendimento VIP:*\n` +
    `✨ *Procedimento:* ${booking.serviceTitle}\n` +
    `📅 *Data marcada:* ${dateFormatted}\n` +
    `⏰ *Horário:* ${booking.time}\n` +
    `👑 *Profissional:* ${booking.professionalName || 'Nossa Especialista'}\n` +
    `📍 *Endereço:* ${studioSettings.address} · ${studioSettings.cityState}\n` +
    `💰 *Investimento:* R$ ${booking.total.toFixed(2).replace('.', ',')} (${paymentText})\n\n` +
    `☀️ *Diquinhas com carinho para o seu bronze ficar um espetáculo:*\n` +
    `• Beba bastante água nas horas anteriores para a pele ficar bem nutrida.\n` +
    `• Faça uma esfoliação corporal leve 24h antes.\n` +
    `• No dia do atendimento, venha com roupinha soltinha e sem hidratante, perfume ou desodorante.\n\n` +
    `Estamos preparando um espaço climatizado, acolhedor e super cheiroso para você relaxar e sair daqui radiante, dourada e com a marquinha dos seus sonhos! ✨👙\n\n` +
    `Se precisar alterar algo ou tiver qualquer dúvida, é só nos chamar aqui. Um beijo bem carinhoso e até lá! 💋✨`
  );
}

/**
 * Generates an alert message sent to the chosen professional's smartphone.
 */
export function generateStaffNotificationMessage(
  booking: Booking,
  studioSettings: StudioSettings,
  staffMember?: StaffMember
): string {
  const dateFormatted = booking.date.split('-').reverse().join('/');
  const professionalName = staffMember?.name || booking.professionalName || 'Especialista';
  const paymentText =
    booking.paymentMethod === 'local' ? 'Pagamento no Local' : 'Pix Antecipado';

  // If a custom template is defined, replace placeholders
  if (studioSettings.customStaffMessageTemplate && studioSettings.customStaffMessageTemplate.trim()) {
    return studioSettings.customStaffMessageTemplate
      .replace(/{profissional}/g, professionalName)
      .replace(/{cliente}/g, booking.clientName)
      .replace(/{telefone}/g, booking.clientPhone)
      .replace(/{servico}/g, booking.serviceTitle)
      .replace(/{data}/g, dateFormatted)
      .replace(/{horario}/g, booking.time)
      .replace(/{fototipo}/g, booking.phototype)
      .replace(/{gestante}/g, booking.pregnant)
      .replace(/{saude}/g, booking.health)
      .replace(/{valor}/g, booking.total.toFixed(2).replace('.', ','))
      .replace(/{pagamento}/g, paymentText)
      .replace(/{estudio}/g, studioSettings.studioName);
  }

  // Default professional notification
  return (
    `🚨✨ *NOVO AGENDAMENTO CONFIRMADO NO APP!* ✨🚨\n\n` +
    `Olá, *${professionalName}*! Uma cliente acabou de garantir horário na sua agenda:\n\n` +
    `👤 *Cliente:* ${booking.clientName}\n` +
    `📱 *WhatsApp:* ${booking.clientPhone}\n` +
    `✨ *Procedimento:* ${booking.serviceTitle}\n` +
    `📅 *Data:* ${dateFormatted}\n` +
    `⏰ *Horário:* ${booking.time}\n` +
    `🎨 *Fototipo Declarado:* ${booking.phototype}\n` +
    `🤰 *Gestante/Lactante:* ${booking.pregnant}\n` +
    `🩺 *Saúde/Observações:* ${booking.health}\n` +
    `💰 *Valor Total:* R$ ${booking.total.toFixed(2).replace('.', ',')} (${paymentText})\n\n` +
    `Por favor, reserve a sala e os materiais para este atendimento. A ficha completa já está disponível no painel administrativo!`
  );
}
