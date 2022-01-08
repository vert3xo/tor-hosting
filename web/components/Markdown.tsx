import { Code, Text } from "@chakra-ui/react";
import { FC } from "react";
import ReactMarkdown from "react-markdown";

const Markdown: FC<{ children?: any }> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{
        p({ children }) {
          return <Text>{children}</Text>;
        },
        code({ children }) {
          return <Code>{children}</Code>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
