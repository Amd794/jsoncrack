import React from "react";
import styled from "styled-components";

const StyledFrame = styled.iframe`
  border: none;
  width: 80%;
  flex: 500px;
  margin: 3% auto;
`;

interface CodepenEmbedProps {
  id: string;
  title: string;
  defaultTab?: string;
  height?: string;
  scrolling?: string;
}

const CodepenEmbed: React.FC<CodepenEmbedProps> = ({
  id,
  title,
  defaultTab = "html,result",
  height = "400",
  scrolling,
}) => {
  return (
    <StyledFrame
      title={title}
      src={`https://codepen.io/AykutSarac/embed/${id}?default-tab=${defaultTab}`}
      loading="lazy"
      height={height}
      scrolling={scrolling}
    />
  );
};

export default CodepenEmbed;
