import styled from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import Button from "./Button";
import { BaseButtonProps } from "./types";

const IconButton: PolymorphicComponent<BaseButtonProps, "button"> = styled(Button)<BaseButtonProps>`
  padding: 2px;
  width: ${({ scale }) => (scale === "xs" ? "auto" : scale === "sm" ? "32px" : "48px")};
  color: ${({ theme }) => (theme.isDark ? "rgb(255 255 255 / 1)" : "rgb(17,24,39,1)")};
`;

export default IconButton;
