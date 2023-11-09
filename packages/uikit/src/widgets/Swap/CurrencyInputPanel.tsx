import { AtomBox } from "@pancakeswap/ui";
import styled from "styled-components";
import { NumericalInput, NumericalInputProps } from "./NumericalInput";

type ZapStyle = "noZap" | "zap";

const StyledInputContainer = styled(AtomBox)`
  flex: 1;
  &:focus-within {
    box-shadow: none;
  }
`;

const StyledInput = styled(NumericalInput)`
  box-shadow: none;
  &:focus-within,
  &:focus,
  &:active {
    box-shadow: none;
  }
`;
interface CurrencyInputPanelProps extends Omit<NumericalInputProps, "onBlur"> {
  onInputBlur?: () => void;
  id: string;
  zapStyle?: ZapStyle;
  top?: React.ReactNode;
  left?: React.ReactNode;
  bottom?: React.ReactNode;
  showBridgeWarning?: boolean;
}
export function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  zapStyle,
  top,
  bottom,
  id,
  disabled,
  error,
  loading,
  left,
  showBridgeWarning,
}: CurrencyInputPanelProps) {
  return (
    <AtomBox position="relative" id={id} display="grid" gap="4px">
      <AtomBox display="flex" alignItems="center" justifyContent="space-between">
        {top}
      </AtomBox>
      <AtomBox display="flex" flexDirection="column" flexWrap="nowrap" position="relative" zIndex="1">
        {/* <AtomBox
          as="label"
          flex={1}
          className={inputContainerVariants({
            hasZapStyle: !!zapStyle,
            showBridgeWarning: !!showBridgeWarning,
            error,
          })}
        > */}
        <AtomBox
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          color="text"
          fontSize="12px"
          lineHeight="16px"
          px="16px"
          pt="12px"
          style={{ border: "none", padding: 0 }}
        >
          {/* TODO: Input panel */}
          <NumericalInput
            error={error}
            disabled={disabled}
            loading={loading}
            className="token-amount-input"
            value={value}
            onBlur={onInputBlur}
            onUserInput={(val) => {
              onUserInput(val);
            }}
          />
        </AtomBox>
        {bottom}
      </AtomBox>
      {disabled && (
        <AtomBox role="presentation" position="absolute" inset="0px" backgroundColor="backgroundAlt" opacity="0.6" />
      )}
      {/* </AtomBox> */}
    </AtomBox>
  );
}
