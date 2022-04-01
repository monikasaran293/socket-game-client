import { Avatar, Grid, Typography } from "@mui/material"
import { styled } from '@mui/material/styles';
import { ReactComponent as LogoIcon } from "../assets/logo.svg";

const StyledHeader = styled(Grid)`
  height: 72px;
  background: #FF8000;
`
const StyledLogo = styled(Grid)`
  margin: auto 10px;  
`
const HeadingWrapper = styled(Grid)`
  margin: auto 10px;
  color: white;
`
const StyledText = styled(Typography)`
font-weight: 700;
font-size: 18px;
line-height: 20px;
`
const StyledSubText = styled(Typography)`
font-weight: 400;
font-size: 14px;
line-height: 24px;
`
const Header = () => {
  return (
    <StyledHeader container>
      <StyledLogo item><LogoIcon /></StyledLogo>
      <HeadingWrapper item>
        <StyledText>Playing with Sabrican</StyledText>
        <StyledSubText>Win the game or win the job</StyledSubText>
      </HeadingWrapper>
    </StyledHeader>
  )
}

export default Header