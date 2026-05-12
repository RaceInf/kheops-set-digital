import { useEffect, useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { incrementLikes, onArticleStatsChange } from '@/lib/firebase';

interface LikeButtonProps {
  articleId: string;
  initialCount?: number; // facultatif pour éviter le "clignotement" lors du premier rendu
  className?: string; // permet de customiser depuis le parent
  showCount?: boolean; // afficher ou non le compteur
  iconClassName?: string; // classes supplémentaires pour l'icône
}

/**
 * Bouton "J'aime" anonyme synchrone avec Firebase.
 * - Pas d'authentification : on stocke juste un flag dans localStorage pour bloquer le double vote.
 * - Incrément atomique via Firestore.
 * - Mise à jour temps réel grâce au listener onSnapshot.
 */
export default function LikeButton({ articleId, initialCount = 0, className = '', showCount = true, iconClassName = '' }: LikeButtonProps) {
  const [likes, setLikes]   = useState<number>(initialCount);
  const [liked, setLiked]   = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Abonnement temps réel aux stats dès le montage
  useEffect(() => {
    if (!articleId) return;

    // Déterminer si l'utilisateur a déjà voté
    setLiked(localStorage.getItem(`liked_${articleId}`) === 'true');

    // Écouter Firestore
    const unsubscribe = onArticleStatsChange(articleId, (stats) => {
      setLikes(stats.likes);
    });
    return () => unsubscribe();
  }, [articleId]);

  const handleClick = useCallback(async () => {
    if (liked || loading) return;
    setLoading(true);
    try {
      await incrementLikes(articleId);
      localStorage.setItem(`liked_${articleId}`, 'true');
      setLiked(true); // feedback immédiat
      // Le compteur sera mis à jour par le listener temps réel
    } catch (err) {
      console.error('Erreur incrément like:', err);
    } finally {
      setLoading(false);
    }
  }, [liked, loading, articleId]);

  return (
    <button
      onClick={handleClick}
      disabled={liked || loading}
      aria-label={liked ? 'Déjà aimé' : 'Aimer'}
      className={`flex items-center ${showCount ? 'gap-1' : ''} ${liked ? 'text-kheops-salmon cursor-not-allowed' : 'text-gray-500 hover:text-kheops-salmon'} ${className}`}
    >
      <Heart className={`${iconClassName || 'w-3 h-3'} ${liked ? 'fill-current' : ''}`} />
      {showCount && <span>{likes.toLocaleString()}</span>}
    </button>
  );
}
