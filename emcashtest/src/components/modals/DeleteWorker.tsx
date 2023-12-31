import React from 'react'
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import axios, { AxiosResponse, AxiosError } from 'axios';
import AuthConfig from '../../services/AuthConfig';
import OrangeButton from '../generics/OrangeButton';
import GrayButton from '../generics/GrayButton';

interface AddWorkerProps {
    isOpen: boolean;
    onClose : any,
    id: number;
    respostWork: any;
    modalCase: any;
    count: any;
    mostrarAlerta: any
};

const ModalDropFuncionario: React.FC<AddWorkerProps> = ({ isOpen, onClose, id, respostWork, modalCase, count, mostrarAlerta}) => {
    const {handleSubmit} = useForm();
    const {config} = AuthConfig();
    const url = `http://18.117.195.42/funcionario`;

    if (!isOpen) {
        return null;
    }    

    const onSubmit = () => {
        
        modalCase('Delete');

        if(Array.isArray(id)){            
            const deleteMultipleElements = async (idArray: number[]) => {
                try {
                  const deletePromises = idArray.map(async (id) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const response = await axios.delete(url+`/${id}`, config)
                        .then((response: AxiosResponse) => {
                            console.log('Resposta: ', response);
                        })
                  })
              
                  const results = await Promise.all(deletePromises);
                  console.log('Elementos excluídos com sucesso:', results);
                  count(0);
                  respostWork(1);
                  mostrarAlerta(true);
                } catch (error) {
                  console.error('Erro ao excluir elementos:', error);
                  respostWork(-2);
                  mostrarAlerta(true);
                }
              };
              deleteMultipleElements(id);
        }else{
            const urlDel = url+`/${id}`;
            axios.delete(urlDel, config)
                .then((response: AxiosResponse) => {
                    console.log('Resposta: ', response);
                    respostWork(0);
                    mostrarAlerta(true);
                })
                .catch((error: AxiosError )=> {
                    console.log('Erro: ', error);
                    respostWork(-1);
                    mostrarAlerta(true);
                })
        }
        onClose(true);
    };

    return (
       <WholeModal>
            <FormModal onSubmit={handleSubmit(onSubmit)}>
                    <DropTitle>Apagar funcionário(s)</DropTitle>
                    <DropSubTitle>Esta ação é irreversível. Tem certeza que deseja Apagar
                        este(s) funcionário(s) do sistema?
                    </DropSubTitle>
                    <ButtonModal>
                        <GrayButton size='medium' onClick={onClose}>Cancelar</GrayButton>
                        <OrangeButton size='medium' type='submit'>Apagar</OrangeButton>
                    </ButtonModal>
            </FormModal>
        </WholeModal>
    )
};

export default ModalDropFuncionario;

const WholeModal = styled.div`
    left: 33%;
    top: 20%;
    position: absolute;
    display: flex;
    width: 414px;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
`
const FormModal = styled.form`
    border-radius: 12px;
    background: var(--base-branco, #FFF);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    width: 414px;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
`
const DropTitle = styled.h2`
    color: #000;
    font-family: Manrope;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 23.5px;
    letter-spacing: -0.4px;
`
const DropSubTitle = styled.h3`
    color: #000;
    font-family: Public Sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 18.8px;
    letter-spacing: -0.4px;
`
const ButtonModal = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 2%;
    align-self: stretch;
`