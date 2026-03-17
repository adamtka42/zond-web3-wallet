import { Button } from "@/components/UI/Button";
import { ROUTES } from "@/router/router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NewChain = () => {
  const { t } = useTranslation();
  return (
    <Link
      to={ROUTES.ADD_EDIT_CHAIN}
      state={{ hasState: true }}
      aria-label={t('chain.addCustomBlockchain')}
    >
      <Button
        className="flex w-full gap-2"
        aria-label={t('chain.addCustomBlockchain')}
      >
        <Plus size="18" /> {t('chain.addCustomBlockchain')}
      </Button>
    </Link>
  );
};

export default NewChain;
