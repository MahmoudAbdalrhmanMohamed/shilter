const workshops = [
  {
    id:1,
    name: "name",
    address: "address",
    phone: 546464,
    description: "this is a description",
    image:
      "https://www.youtube.com/s/desktop/9d2e520a/img/logos/favicon_144x144.png",
    date: new Date().toISOString().split("T")[0],
    services: "services",
    models: "models",
    visits: 25,
    socialMedias: [
      { platform: "instagram", url: "https://www.instagram.com/" },
      { platform: "facebook", url: "https://www.facebook.com/" },
      { platform: "whatsapp", url: "https://web.whatsapp.com/" },
      { platform: "telegram", url: "https://web.telegram.org/" },
    ],
    daysPerWeek: "Days per Week",
    opening_CloseTime: "Opening - Close Time",
    rating: "3",
  },
];

export default workshops;
