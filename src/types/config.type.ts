type CustomerType = {
  name: string;
  siret: string;
  website: string;
  tva: string;
  address: string;
};

export type ConfigType = {
  invoice: {
    count: number;
  };
  customers: CustomerType[];
  company: string;
  contact: string;
  address: string;
  siret: string;
  iban: string;
  bic: string;
  tva: string;
  phone: string;
  mail: string;
  website: string;
  tjm: number;
};
