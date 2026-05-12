// Import des fonctions nécessaires depuis Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc, onSnapshot } from 'firebase/firestore';

// Types pour Firestore
type ArticleStats = {
  likes: number;
  views: number;
};

// Configuration Firebase (vos identifiants)
const firebaseConfig = {
  apiKey: "AIzaSyCx6KGiRoL2j730xxMUoDpPN9O6PCgS9So",
  authDomain: "ksd---siteweb.firebaseapp.com",
  projectId: "ksd---siteweb",
  storageBucket: "ksd---siteweb.firebasestorage.app",
  messagingSenderId: "94115932717",
  appId: "1:94115932717:web:fe8fc7ec3321929bfc26a4",
  measurementId: "G-X8XCGPGCQQ"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase initialisé avec la configuration :', firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);
console.log('Firestore initialisé');

// Fonction pour incrémenter les likes
export const incrementLikes = async (articleId: string) => {
  console.log('incrementLikes - Début - ID:', articleId);
  try {
    const articleRef = doc(db, 'articles', articleId);
    console.log('incrementLikes - Référence document créée');
    
    // Utiliser setDoc avec merge:true pour créer le document s'il n'existe pas
    await setDoc(articleRef, {
      likes: increment(1)
    }, { merge: true });
    
    console.log('incrementLikes - Like incrémenté avec succès');
  } catch (error) {
    console.error('incrementLikes - Erreur:', error);
    throw error; // Propager l'erreur pour une gestion ultérieure
  }
};

// Fonction pour incrémenter les vues
export const incrementViews = async (articleId: string) => {
  const articleRef = doc(db, 'articles', articleId);
  await setDoc(articleRef, {
    views: increment(1)
  }, { merge: true });
};

// Fonction pour obtenir les statistiques d'un article
export const getArticleStats = async (articleId: string): Promise<ArticleStats> => {
  try {
    console.log(`Récupération des stats pour l'article ${articleId}...`);
    const articleRef = doc(db, 'articles', articleId);
    const articleSnap = await getDoc(articleRef);
    
    if (articleSnap.exists()) {
      const data = articleSnap.data();
      console.log(`Données brutes de Firestore pour l'article ${articleId}:`, data);
      
      // Extraire les valeurs en tenant compte du format Firestore
      const likes = typeof data.likes === 'number' ? data.likes : 
                   (data.likes?.integerValue ? parseInt(data.likes.integerValue) : 0);
      const views = typeof data.views === 'number' ? data.views : 
                   (data.views?.integerValue ? parseInt(data.views.integerValue) : 0);
      
      const result = { likes, views };
      console.log(`Statistiques extraites pour l'article ${articleId}:`, result);
      return result;
    } else {
      console.log(`L'article ${articleId} n'existe pas encore dans Firestore, création...`);
      // Si l'article n'existe pas encore dans Firestore, on le crée avec des valeurs par défaut
      try {
        await setDoc(articleRef, {
          likes: 0,
          views: 0,
          lastUpdated: new Date().toISOString()
        });
        console.log(`Article ${articleId} créé avec succès dans Firestore`);
      } catch (createError) {
        console.error(`Erreur lors de la création de l'article ${articleId}:`, createError);
        throw createError;
      }
      return { likes: 0, views: 0 };
    }
  } catch (error) {
    console.error(`Erreur dans getArticleStats pour l'article ${articleId}:`, error);
    throw error;
  }
};

// Abonnement en temps réel aux statistiques d'un article
export const onArticleStatsChange = (
  articleId: string,
  callback: (data: ArticleStats) => void
) => {
  const articleRef = doc(db, 'articles', articleId);
  return onSnapshot(
    articleRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data: any = snapshot.data();
        callback({
          likes: typeof data.likes === 'number' ? data.likes : (data.likes?.integerValue ? parseInt(data.likes.integerValue) : 0),
          views: typeof data.views === 'number' ? data.views : (data.views?.integerValue ? parseInt(data.views.integerValue) : 0),
        });
      }
    },
    (error) => {
      console.error('onArticleStatsChange error:', error);
    }
  );
};

// Alias plus explicite pour les composants
export const subscribeArticleStats = onArticleStatsChange;

