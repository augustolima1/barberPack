import React from "react";
import Header                        from '~/components/Header';

import {
  Container,
  Box,
  Message
} from "./styles";
 

export default function Main() {
 

 

  return (
    <>
    <Header title={"Home"}/> 
    <Container>
       <Box>
          <Message>Bem Vindo</Message>
        </Box>
      
    </Container>
    </>
  );
}
