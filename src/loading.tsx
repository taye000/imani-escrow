import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import { useThemeContext } from "./context/ThemeContext";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Loading = () => {
  const { mode } = useThemeContext();
  const spinnerColor = mode === "light" ? "#000" : "#fff";

  return (
    <LoadingContainer>
      <ClipLoader color={spinnerColor} size={50} />
    </LoadingContainer>
  );
};

export default Loading;
