import React, {useState} from "react";
import { useForm } from "react-hook-form";
import styled from 'styled-components'
import { AiFillCheckCircle, AiOutlineClose } from 'react-icons/ai'
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";
import OrangeButton from "../generics/OrangeButton";

type FormValues = {
    usuario: string,
    senha: string
};

export default function SecondHalfPage() {

  const handleClick = () => {   
    setLoginError(false);
  };
  
  const [loginError, setLoginError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>();
  const {register, handleSubmit} = form;

    const onSubmit = (data: FormValues) => {
        const url = 'http://18.117.195.42/login';

        axios.post(url, data)
            .then((response: AxiosResponse) => {
                localStorage.setItem('token', response.data.access_token)
            })
            .then(response => {
                setLoggedIn(true)
            })
            .catch((error: AxiosError )=> {
                setLoginError(true);
                console.log('Erro: ', error);
            });
    };

    if (loggedIn) {
        navigate('/dashboard');
    }

  return (
    <WholePage>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <TitleForm>Seja bem-vindo!</TitleForm>
            <SubTitleForm>Insira os seus dados nos campos abaixo para acessar sua conta.</SubTitleForm>
            <RegisterInput {...register("usuario", { required: true })} placeholder="Usuário" />
            <RegisterInput {...register("senha", { required: true })} type="password" placeholder="Senha" />
            <LoginInvalid style={{display: loginError ? 'flex' : 'none'}}>
                <LoginInvalidIconCheck>
                    <AiFillCheckCircle size={23}/>
                </LoginInvalidIconCheck>
                <LoginInvalidContent>
                    Usuário e/ou senha incorretos.
                </LoginInvalidContent>
                <LoginInvalidIconX >
                    <AiOutlineClose size={13} onClick={handleClick}/>
                </LoginInvalidIconX>
            </LoginInvalid>
            <ForgotPassword>
                <OrangeLink href="">Esqueci minha senha</OrangeLink>
            </ForgotPassword>
            <OrangeButton size='large' type='submit' customStyles={{margin: '0% 13%'}}>Entrar</OrangeButton>
            <NotYet>
                <NotYetText>
                    Ainda não tem uma conta?
                </NotYetText>
                <OrangeLink  href="">
                    Cadastrar
                </OrangeLink>
            </NotYet>
        </Form>
        <NeedHelp>
            <OrangeLink>
                Precisa de Ajuda?
            </OrangeLink>
        </NeedHelp>
    </WholePage>
  )
};

const WholePage = styled.div`
    background: linear-gradient(286deg, rgba(243, 243, 243, 0.16) 8.14%, rgba(243, 243, 243, 0.04) 38.39%, rgba(243, 243, 243, 0.16) 88.69%);
    box-shadow: 0px 0px 30px 0px rgba(12, 5, 7, 0.10);
    backdrop-filter: blur(5px);
`
const Form = styled.form`
    padding: 22% 23% 0% 23%;
`
const TitleForm = styled.h1`
    color: var(--primary-500, #EF6F2B);
    font-family: Poppins;
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: 54px;
    letter-spacing: -0.4px;
    margin: 0% 6%;
`
const SubTitleForm = styled.h3`
    color: var(--dark-500, #1B1B1B);
    text-align: center;
    font-family: Public Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 18.8px;
    letter-spacing: -0.4px;
    width: 75%;
`
const RegisterInput = styled.input`
    display: flex;
    border-radius: 11px;
    padding: 18.5px 6px;
    width: 264px;
    align-items: center;
    gap: 2px;
    flex: 1 0 0;
    margin: 6% 2%;
    color: var(--dark-500, #1B1B1B);
    font-family: Manrope;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 18.8px;
    letter-spacing: -0.2px;
`
const LoginInvalid = styled.div`
    border-radius: 4px;
    display: flex;
    width: 280px;
    justify-content:center;
    margin: 6% 2%;
    gap: 12px;
    border: 1px solid #FEBFB8;
    background: var(--red-100, #FFE1DB);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
`
const LoginInvalidContent = styled.h3`
    color: #AD2C55;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 19.5px;
    letter-spacing: -0.2px;
`
const LoginInvalidIconCheck = styled.i`
    color: #AD2C55;
    padding: 14px 1px 0px 0px;
`
const LoginInvalidIconX = styled.div`
    color: #AD2C55;
    padding: 15px 1px 0px 0px;
    cursor: pointer;
`
const ForgotPassword = styled.div`
    color: var(--primary-500, #EF6F2B);
    text-align: right;
    font-size: 17px;
    margin:5% 21%;
    font-style: normal;
    font-weight: 400;
    line-height: 19.5px;
    letter-spacing: -0.2px;
`
const OrangeLink = styled.a`
    color: var(--primary-500, #EF6F2B);
    text-decoration: none;
`
const NotYet = styled.div`
    margin: 6% 6%;
    font-family: Poppins;
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: 19.5px;
    letter-spacing: -0.2px;
`
const NotYetText = styled.span`
    padding-right: 4px
`
const NeedHelp = styled.div`
    padding: 5% 0% 6% 58%;
`