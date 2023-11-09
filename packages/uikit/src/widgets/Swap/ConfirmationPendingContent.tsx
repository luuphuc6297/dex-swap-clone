import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";
import { AutoColumn, ColumnCenter } from "../../components/Column";
import Loader from "./Loader";

const Wrapper = styled.div`
  width: 100%;
`;
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
  margin-top: 64px;
  margin-bottom: 64px;
`;

export function ConfirmationPendingContent({ pendingText }: { pendingText?: string }) {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <ConfirmedIcon>
        <Loader />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        {pendingText ? (
          <>
            <p className="text-lg font-medium -tracking-wider md:text-xl xl:text-2xl">
              {t("Waiting For Confirmation")}
            </p>
            <AutoColumn gap="12px" justify="center">
              <p>{pendingText}</p>
            </AutoColumn>
          </>
        ) : null}
        <p className="mt-1 block text-xs tracking-tighter text-gray-600 dark:text-gray-400 sm:text-sm">
          {t("Confirm this transaction in your wallet")}
        </p>
      </AutoColumn>
    </Wrapper>
  );
}
