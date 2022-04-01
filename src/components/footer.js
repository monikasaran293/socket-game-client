import { Grid } from "@mui/material"
import { styled } from '@mui/material/styles';

const StyledFooter = styled(Grid)`
  position: absolute;
  height: 72px;
  left: 0%;
  right: 0%;
  background: #0A3847;
`
const Footer = () => {
  return (
    <StyledFooter container>

    </StyledFooter>
  )
}

export default Footer