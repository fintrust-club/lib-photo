export const createWhatsappLink = (
  _phone: string,
  countryCode: string = "91"
) => {
  const link = `https://wa.me/${countryCode}${_phone}`;
  return link;
};
