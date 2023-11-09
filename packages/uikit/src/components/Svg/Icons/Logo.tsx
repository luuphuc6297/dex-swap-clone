/* eslint-disable react/style-prop-object */
import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = () => {
  return (
    <svg width="453" height="375" viewBox="0 0 453 375" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M261.57 39.9845L182.94 119.038L264.9 200.559L343.53 121.506L261.57 39.9845Z" fill="#0062D4" />
      <path d="M103.841 40.4558L0.388062 144.466L79.4416 223.096L182.894 119.086L103.841 40.4558Z" fill="#0062D4" />
      <g opacity="0.5">
        <mask
          id="mask0_0_1"
          // @ts-ignore
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="103"
          y="0"
          width="159"
          height="119"
        >
          <path d="M261.5 0.699951H103.9V119H261.5V0.699951Z" fill="white" />
        </mask>
        <g mask="url(#mask0_0_1)">
          <path d="M143.2 0.899956L103.9 40.5L182.9 119.1L261.6 40L222 0.699951L143.2 0.899956Z" fill="#3DEDE5" />
        </g>
      </g>
      <path d="M188.606 174.358L109.976 253.412L191.937 334.933L270.566 255.88L188.606 174.358Z" fill="#0062D4" />
      <path d="M373.923 151.817L270.47 255.828L349.523 334.458L452.976 230.447L373.923 151.817Z" fill="#0062D4" />
      <g opacity="0.5">
        {/* @ts-ignore */}
        <mask
          id="mask1_0_1"
          // @ts-ignore
          style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="191"
          y="255"
          width="159"
          height="120"
        >
          <path d="M349.5 255.9H191.9V374.2H349.5V255.9Z" fill="white" />
        </mask>
        <g mask="url(#mask1_0_1)">
          <path d="M191.9 334.9L231.4 374.2L310.2 374L349.5 334.5L270.5 255.9L191.9 334.9Z" fill="#3DEDE5" />
        </g>
      </g>
    </svg>
  );
};

export default Icon;
