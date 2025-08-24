// UndercoveR Word Pairs Database
// Each pair has a civilian word and an undercover word that are similar but different

export interface WordPair {
  civilian: string;
  undercover: string;
}

export const wordPairs: WordPair[] = [
  // Technology
  { civilian: "iPhone", undercover: "Samsung" },
  { civilian: "Netflix", undercover: "Disney+" },
  { civilian: "Google", undercover: "Bing" },
  { civilian: "Instagram", undercover: "TikTok" },
  { civilian: "Tesla", undercover: "BMW" },
  { civilian: "PlayStation", undercover: "Xbox" },
  { civilian: "Zoom", undercover: "Skype" },
  { civilian: "Spotify", undercover: "Deezer" },
  { civilian: "YouTube", undercover: "Twitch" },
  { civilian: "WhatsApp", undercover: "Telegram" },

  // Food & Drinks
  { civilian: "Coca-Cola", undercover: "Pepsi" },
  { civilian: "McDonald's", undercover: "Burger King" },
  { civilian: "Pizza", undercover: "Burger" },
  { civilian: "Café", undercover: "Thé" },
  { civilian: "Chocolat", undercover: "Bonbon" },
  { civilian: "Croissant", undercover: "Pain au chocolat" },
  { civilian: "Fromage", undercover: "Yaourt" },
  { civilian: "Pomme", undercover: "Poire" },
  { civilian: "Eau", undercover: "Jus" },
  { civilian: "Vin", undercover: "Bière" },

  // Animals
  { civilian: "Chat", undercover: "Chien" },
  { civilian: "Lion", undercover: "Tigre" },
  { civilian: "Aigle", undercover: "Faucon" },
  { civilian: "Requin", undercover: "Dauphin" },
  { civilian: "Serpent", undercover: "Lézard" },
  { civilian: "Cheval", undercover: "Poney" },
  { civilian: "Lapin", undercover: "Lièvre" },
  { civilian: "Souris", undercover: "Rat" },
  { civilian: "Abeille", undercover: "Guêpe" },
  { civilian: "Papillon", undercover: "Libellule" },

  // Transport
  { civilian: "Voiture", undercover: "Moto" },
  { civilian: "Avion", undercover: "Hélicoptère" },
  { civilian: "Train", undercover: "Métro" },
  { civilian: "Bateau", undercover: "Yacht" },
  { civilian: "Vélo", undercover: "Trottinette" },
  { civilian: "Bus", undercover: "Tramway" },
  { civilian: "Taxi", undercover: "Uber" },
  { civilian: "Fusée", undercover: "Navette" },

  // Entertainment
  { civilian: "Cinéma", undercover: "Théâtre" },
  { civilian: "Concert", undercover: "Festival" },
  { civilian: "Livre", undercover: "Journal" },
  { civilian: "Jeu vidéo", undercover: "Application" },
  { civilian: "Football", undercover: "Rugby" },
  { civilian: "Tennis", undercover: "Badminton" },
  { civilian: "Ski", undercover: "Snowboard" },
  { civilian: "Piscine", undercover: "Plage" },

  // Objects
  { civilian: "Téléphone", undercover: "Tablette" },
  { civilian: "Ordinateur", undercover: "Laptop" },
  { civilian: "Montre", undercover: "Bracelet" },
  { civilian: "Lunettes", undercover: "Lentilles" },
  { civilian: "Parapluie", undercover: "Parasol" },
  { civilian: "Sac", undercover: "Valise" },
  { civilian: "Chaussures", undercover: "Baskets" },
  { civilian: "Chapeau", undercover: "Casquette" },

  // Nature
  { civilian: "Soleil", undercover: "Lune" },
  { civilian: "Mer", undercover: "Océan" },
  { civilian: "Montagne", undercover: "Colline" },
  { civilian: "Forêt", undercover: "Jungle" },
  { civilian: "Rivière", undercover: "Lac" },
  { civilian: "Fleur", undercover: "Plante" },
  { civilian: "Arbre", undercover: "Buisson" },
  { civilian: "Nuage", undercover: "Brouillard" },

  // Professions
  { civilian: "Médecin", undercover: "Infirmier" },
  { civilian: "Professeur", undercover: "Instituteur" },
  { civilian: "Police", undercover: "Gendarme" },
  { civilian: "Pompier", undercover: "Sauveteur" },
  { civilian: "Cuisinier", undercover: "Pâtissier" },
  { civilian: "Avocat", undercover: "Juge" },
  { civilian: "Pilote", undercover: "Steward" },
  { civilian: "Musicien", undercover: "Chanteur" },

  // Colors & Appearance
  { civilian: "Rouge", undercover: "Rose" },
  { civilian: "Bleu", undercover: "Turquoise" },
  { civilian: "Vert", undercover: "Kaki" },
  { civilian: "Jaune", undercover: "Orange" },
  { civilian: "Noir", undercover: "Gris" },
  { civilian: "Blanc", undercover: "Beige" },

  // Weather
  { civilian: "Pluie", undercover: "Orage" },
  { civilian: "Neige", undercover: "Grêle" },
  { civilian: "Vent", undercover: "Tempête" },
  { civilian: "Chaud", undercover: "Tiède" },
  { civilian: "Froid", undercover: "Frais" },

  // Places
  { civilian: "Maison", undercover: "Appartement" },
  { civilian: "École", undercover: "Université" },
  { civilian: "Hôpital", undercover: "Clinique" },
  { civilian: "Restaurant", undercover: "Café" },
  { civilian: "Magasin", undercover: "Boutique" },
  { civilian: "Banque", undercover: "Poste" },
  { civilian: "Pharmacie", undercover: "Laboratoire" },
  { civilian: "Parc", undercover: "Jardin" },

  // Activities
  { civilian: "Courir", undercover: "Marcher" },
  { civilian: "Nager", undercover: "Plonger" },
  { civilian: "Danser", undercover: "Chanter" },
  { civilian: "Lire", undercover: "Écrire" },
  { civilian: "Cuisiner", undercover: "Pâtisser" },
  { civilian: "Peindre", undercover: "Dessiner" },
  { civilian: "Dormir", undercover: "Rêver" },
  { civilian: "Voyager", undercover: "Explorer" },

  // Time
  { civilian: "Matin", undercover: "Soir" },
  { civilian: "Jour", undercover: "Nuit" },
  { civilian: "Hier", undercover: "Demain" },
  { civilian: "Semaine", undercover: "Mois" },
  { civilian: "Printemps", undercover: "Automne" },
  { civilian: "Été", undercover: "Hiver" },

  // Abstract concepts
  { civilian: "Amour", undercover: "Amitié" },
  { civilian: "Bonheur", undercover: "Joie" },
  { civilian: "Peur", undercover: "Stress" },
  { civilian: "Rêve", undercover: "Cauchemar" },
  { civilian: "Succès", undercover: "Victoire" },
  { civilian: "Problème", undercover: "Défi" },
];

// Helper function to get a random word pair
export function getRandomWordPair(usedPairs: WordPair[] = []): WordPair {
  const availablePairs = wordPairs.filter(pair => 
    !usedPairs.some(used => used.civilian === pair.civilian)
  );
  
  if (availablePairs.length === 0) {
    // If all pairs have been used, return from the 10 oldest
    const sortedUsed = [...usedPairs].slice(-10);
    const reusablePairs = wordPairs.filter(pair =>
      !sortedUsed.some(used => used.civilian === pair.civilian)
    );
    
    if (reusablePairs.length === 0) {
      return wordPairs[Math.floor(Math.random() * wordPairs.length)];
    }
    
    return reusablePairs[Math.floor(Math.random() * reusablePairs.length)];
  }
  
  return availablePairs[Math.floor(Math.random() * availablePairs.length)];
}