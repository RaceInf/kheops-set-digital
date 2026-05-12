import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Check } from "lucide-react";
import PricingContactForm from "./PricingContactForm";
import { PricingPlan, PricingPeriod, PLAN_PRICES } from '@/types/pricing';

interface PricingFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: PricingPlan;
  selectedPeriod?: PricingPeriod;
  initialPrice: number;
}

const PLAN_DATA = {
  Starter: {
    description: "L'essentiel pour démarrer votre présence en ligne",
    features: [
      "Gestion de 2 réseaux sociaux",
      "8 publications par mois",
      "Modération des commentaires",
      "Rapport mensuel simplifié"
    ]
  },
  Pro: {
    description: "La solution complète pour développer votre audience",
    features: [
      "Gestion de 2 réseaux sociaux",
      "16 publications par mois",
      "Création de visuels personnalisés",
      "Modération et réponses aux messages",
      "Veille concurrentielle",
      "Rapport mensuel détaillé"
    ]
  },
  Premium: {
    description: "Une stratégie sur mesure pour maximiser votre impact",
    features: [
      "Gestion de 4 réseaux sociaux",
      "30 publications par mois",
      "Création de contenus avancés (vidéos, animations)",
      "Community management proactif",
      "Stratégie éditoriale personnalisée",
      "Réunion mensuelle de suivi",
      "Rapport d'analyse approfondi"
    ]
  }
};

const PricingFormDialog: React.FC<PricingFormDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedPlan,
  selectedPeriod = "monthly",
  initialPrice
}) => {
  const [selectedPlanState, setSelectedPlan] = React.useState(selectedPlan);
  const planData = PLAN_DATA[selectedPlanState];
  
  // Mettre à jour l'état local lorsque selectedPlan change
  React.useEffect(() => {
    setSelectedPlan(selectedPlan);
  }, [selectedPlan]);

  const handlePlanChange = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    // Réinitialiser complètement le formulaire
    const contactForm = document.querySelector('form');
    if (contactForm) {
      contactForm.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[750px] rounded-xl mx-2 sm:mx-auto my-2 sm:my-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Confirmation de votre sélection
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Finalisez votre demande pour activer votre forfait {selectedPlanState}.
              </DialogDescription>
            </div>
            
            <div />
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-4">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 overflow-y-auto max-h-[calc(90vh-200px)] sm:max-h-none">
            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-kheops-gold fill-kheops-gold" />
              Votre sélection
            </h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-gray-900">{selectedPlanState}</h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-kheops-gold/10 text-kheops-gold">
                      {selectedPeriod === 'monthly' ? 'Mensuel' : selectedPeriod === 'quarterly' ? 'Trimestriel • -10%' : 'Annuel • -15%'}
                    </span>
                  </div>
                  <div className="h-px w-full bg-gray-100"></div>
                  <p className="text-gray-600">
                    {planData.description}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-kheops-gold flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                  Avantages inclus
                </h4>
                <ul className="space-y-3">
                  {planData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-kheops-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-kheops-gold" strokeWidth={3} />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-1 overflow-y-auto max-h-[calc(90vh-100px)] sm:max-h-none">
            <PricingContactForm 
              initialPlan={selectedPlanState}
              initialPeriod={selectedPeriod}
              initialPrice={initialPrice}
              onSuccess={() => onOpenChange(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingFormDialog;
