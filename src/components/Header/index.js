import React from 'react';
import {Header as _header,Icon,Logo,Title,AlignItem} from './styles';

import {FaBars} from 'react-icons/fa';

const Header = ({title}) => {
    return (
          <_header>
             {/*<Logo>App</Logo>*/}            
             <AlignItem>
                    <Icon>
                        <FaBars size="1.6em"/>
                    </Icon> 
                  <Title>{title}</Title>
              </AlignItem>
           </_header>
          );
};
  
export default Header;