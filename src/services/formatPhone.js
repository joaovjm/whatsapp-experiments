function formatPhone(phone) {
    let phoneFormatted = phone;
    if(phoneFormatted.startsWith('55')){
        phoneFormatted = phoneFormatted.slice(2);
    }
  return phoneFormatted.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export default formatPhone;