import styled from "styled-components";
import dynamic from "next/dynamic";
const Picker = dynamic(async () => import("emoji-picker-react"), { ssr: false});


export const EmojisContainer = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  background-color: #fff;
`;

export const EmojiPickerContainer = styled(Picker)``;
