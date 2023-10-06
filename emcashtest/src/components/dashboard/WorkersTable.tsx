import React, {useState, useEffect} from 'react';
import { BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import { AiOutlineEye } from 'react-icons/ai';
import { PiTrash} from 'react-icons/pi';
import { GoPencil } from 'react-icons/go';
import axios from 'axios';
import styled from "styled-components";
import ModalAddFuncionario from '../modals/AddWorker';
import ModalDropFuncionario from '../modals/DeleteWorker';
import ModalUpdateFuncionario from '../modals/UpdateWorker';
import AuthConfig from '../../services/AuthConfig';
import OrangeButton from '../generics/OrangeButton';
import GrayButton from '../generics/GrayButton';
import AlertGreen from '../generics/AlertGreen';
import { AlertColor } from '@mui/material';

const perPage = 8; // Número de itens por página

export default function WorkersTable() {
    const [funcionarios, setFuncionarios] = useState([
        {
            id: 0,
            nome: 'funcionario',
            cpf: "86853871081",
            cnpj: null,
            celular: '319876543210',
            email: 'funcionario@empresa.com'
        }
    ]) 
    const [count, setCount] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isChecked, setIsChecked] = useState(false);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [selections, setSelections] = useState<any>([]);
    const [isModalAddFuncOpen, setIsModalAddFuncOpen] = useState(false);
    const [isModalDropFuncOpen, setIsModalDropFuncOpen] = useState(false);
    const [isModalUpdateFuncOpen, setIsModalUpdateFuncOpen] = useState(false);
    const [idFuncionario, setIdFuncionario] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [hideCPF, setHideCPF] = useState(false);
    const [modalWork, setModalWork] = useState(0);
    const [respost, setRespost] = useState('');
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [severity, setSeverity] = useState<AlertColor>("error");

    useEffect(() => {
        if (isModalAddFuncOpen || isModalDropFuncOpen || isModalUpdateFuncOpen) {
          document.body.classList.add('modal-open');
          
        } else {
          document.body.classList.remove('modal-open');
        }
    
        return () => {
          document.body.classList.remove('modal-open');
        };
    }, [isModalAddFuncOpen, isModalDropFuncOpen, isModalUpdateFuncOpen]);

    const openModalAddFunc = () => {
        setIsModalAddFuncOpen(true);
        return 0;
    };
  
    const closeModalAddFunc = (event: boolean) => {
        setIsModalAddFuncOpen(false);
    };

    useEffect(() => {
        switch (respost) {
            case 'Add':
                if(modalWork === 400){            
                    setSeverity('error')
                    setMessageAlert('Erro ao adicionar funcionário.');
                    setMostrarAlerta(true);
                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 3000);
                }else if(modalWork === 200){
                    setSeverity('success')
                    setMessageAlert('Funcionário Adicionado com sucesso!');
                    setMostrarAlerta(true);
                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 3000);
                }
                break;
            case 'Update':
                if(modalWork === 400){      
                    setMessageAlert('Erro ao atualizar funcionário.');
                    setSeverity('error')
                    setMostrarAlerta(true);
                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 3000);
        
                }else if(modalWork === 200){
                    setMessageAlert('Funcionário atualizado com sucesso!');
                    setSeverity('success')
                    setMostrarAlerta(true);
                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 3000);
                }        
            break;
            case 'Delete':
                if(modalWork === 400){            
                    setSeverity('error')
                    setMessageAlert('Erro ao excluir funcionário.');
                    setMostrarAlerta(true);
                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 3000);
                }else if(modalWork === 200){
                    setSeverity('success')
                    setMessageAlert('Funcionário Excluído com sucesso!');
                    setMostrarAlerta(true);
                    setTimeout(() => {
                        setMostrarAlerta(false);
                    }, 3000);
                }
                break;
            default:
                break;
        }
    }, [modalWork, respost])

    const openModalDropFunc = (id: React.SetStateAction<number>) => {
        setIdFuncionario(id)
        setIsModalDropFuncOpen(true);
    };
  
    const closeModalDropFunc = (event: boolean, response: any) => {
        setIsModalDropFuncOpen(false);
    };

    const openModalUpdateFunc = (id: React.SetStateAction<number>) => {
        setIdFuncionario(id)
        setIsModalUpdateFuncOpen(true);
    };
  
    const closeModalUpdateFunc = (event: boolean ,response: number) => {
        setIsModalUpdateFuncOpen(false);
    };

    const handleCheckboxChange = (event:any, id:any) => {
        const Cheked = event.target.checked;
        
        if(Array.isArray(id)){
            if(Cheked){                
                setIsAllChecked(true);
                setSelections(id);
                setCount(id.length);  
            }else{
                setIsAllChecked(false);
                setSelections([]);
                setCount(0);
            }
        }else{
            if(Cheked) {
                setIsChecked(true);
                setSelections([...selections, id]);    
                setCount(count + 1);          
            } else {
                // @ts-ignore
                const updatedSelections = selections.filter(data => data !== id);
                setSelections(updatedSelections);
                setCount(count - 1);
            }
        }
    }

    const showCPF = () => {
        hideCPF ? setHideCPF(false) : setHideCPF(true)
    }

    useEffect(() => {        
        const {config} = AuthConfig();
        const fetchData = async () => {
            try{
                const response = await axios.get(`http://18.117.195.42/funcionarios`, config);
                setTotalPages(Math.ceil(response.data.length / perPage));
                const startIndex = (currentPage - 1) * perPage;
                const endIndex = startIndex + perPage;
                const currentEmployees = response.data.slice(startIndex, endIndex);
                setFuncionarios(currentEmployees)                
            }catch(error){
                console.error('Erro na solicitação: ', error);
            }
        }
        fetchData()
    }, [currentPage, modalWork])
    
    const handlePageChange = (newPage: number, totalPages: number) => {
        if((newPage <= totalPages) && (newPage >= 1)){
            setCurrentPage(newPage);
        }
    };

  return (
    <>
        <NavSelection>
            <NavSelectionTitle>
                Lista de funcionários
            </NavSelectionTitle>
            <OrangeButton size='small' onClick={openModalAddFunc}>Adicionar novo</OrangeButton>
            <ModalAddFuncionario respostWork={setModalWork} modalCase={setRespost} isOpen={isModalAddFuncOpen} onClose={closeModalAddFunc}/>
            <ModalDropFuncionario respostWork={setModalWork} modalCase={setRespost} isOpen={isModalDropFuncOpen} onClose={closeModalDropFunc} id={idFuncionario}/>
            <ModalUpdateFuncionario respostWork={setModalWork} modalCase={setRespost} id={idFuncionario} isOpen={isModalUpdateFuncOpen} onClose={closeModalUpdateFunc}/>
            {mostrarAlerta === true ? (
                <AlertSpace>
                    <AlertGreen severity={severity} message={messageAlert} onClick={setMostrarAlerta}/>
                </AlertSpace>
            ) : (
            <>
                <Selected>Selecionados({count})</Selected>
                    <GrayButton size='small'
                        customStyles={{marginLeft: '7px', boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.08)',  color: '#F3F3F3'}}
                        onClick={() => openModalDropFunc(selections)}>
                        Apagar Seleção
                    </GrayButton>
            </>
            )
        }
        </NavSelection>
        <Table>
            <HeadTable>
                <TbRow>
                    <EmptyTableTh>
                        <CheckBox type="checkbox" checked={isAllChecked} onChange={e => handleCheckboxChange(e, (funcionarios.map((data) => data.id)))}/>
                    </EmptyTableTh>
                    <NameTableTh>Nome completo</NameTableTh>
                    <CPFTableTh>CPF/CNPJ <EyeIcon onClick={showCPF}><AiOutlineEye/></EyeIcon></CPFTableTh>
                    <PhoneTableTh>Celular</PhoneTableTh>
                    <EmailTableTh>E-mail</EmailTableTh>
                    <TableTh>Editar</TableTh>
                    <TableTh>Apagar</TableTh>
                </TbRow>
            </HeadTable>
            <BodyTable>
                {funcionarios.map((data) => (
                <TbRowData key={data.id}>
                    <TableTdCheck>                        
                        <CheckBox type="checkbox" checked={selections.includes(data.id)} onChange={e => handleCheckboxChange(e, data.id)}/></TableTdCheck>
                    <TableTd>{data.nome}</TableTd>
                    <TableTdCPF> {(hideCPF) ? '************' : (data.cpf) ? data.cpf : data.cnpj}</TableTdCPF>
                    <TableTd>{data.celular}</TableTd>
                    <TableTd>{data.email}</TableTd>
                    <TableTdIcon onClick={() => openModalUpdateFunc(data.id)}><GoPencil size={23} style={{cursor: 'pointer', color: '#EF6F2B'}}/></TableTdIcon>
                    <TableTdIcon onClick={() => openModalDropFunc(data.id)}><PiTrash size={23} id="trash" style={{cursor: 'pointer', color: '#EF6F2B'}}/></TableTdIcon>
                </TbRowData> 
                ))}
                 
            </BodyTable>
        </Table>
        <Paginator>
                <PaginatorContent >
                    <BsChevronLeft style={{cursor: 'pointer'}} onClick={() => handlePageChange(currentPage - 1, 1)}/>
                    <CurrentPaginator>{currentPage}</CurrentPaginator> de {totalPages}
                    <BsChevronRight style={{cursor: 'pointer'}} onClick={() => handlePageChange(currentPage + 1, totalPages)}/>
                </PaginatorContent>
        </Paginator>
    </>
  );
}

const Paginator = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    margin-top: -1%;
`
const PaginatorContent = styled.p`
    display: flex;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    color: #767676
`
const CurrentPaginator = styled.span`
    color: #EF6F2B
`

const NavSelection = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    align-self: stretch;
`
const NavSelectionTitle = styled.h1`
    margin-right: 1%;
    color: var(--dark-500, #1B1B1B);
    font-family: Manrope;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 23.5px; /* 117.5% */
    letter-spacing: -0.4px;
`

const Selected = styled.h1`
    margin-left: 39%;
    color: #1B1B1B;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 18.8px; /* 117.5% */
    letter-spacing: -0.4px;
`

const Table = styled.table`
    margin-top: 3%;
    padding: 1% 0%;
    width: 100%;
`
const HeadTable = styled.thead`
    display: flex;
    border-radius: 12px 12px 4px 4px;
    background: var(--base-branco, #FFF);
    text-align: left;
    justify-content: flex-start;
`
const TbRow = styled.tr`
    display: flex;
    border-radius: 12px 12px 4px 4px;
    background: var(--base-branco, #FFF);
    width: 100%;
`

const EmptyTableTh = styled.th`
    width: 1%;
    padding: 12px 12px;
`

const TableTh = styled.th`
    font-weight: 500;
    font-size: 17px;
    padding: 14px 0px;
    width: 12%;
`
const NameTableTh = styled.th`
    font-weight: 500;
    font-size: 17px;
    padding: 14px 16px;
    width: 15%;
}
`

const CPFTableTh = styled.th`
    font-weight: 500;
    margin-left: 1%;
    font-size: 17px;
    padding: 14px 20px;
    width: 12%;
    gap: 10px;
}`

const EyeIcon = styled.span`
    padding-left: 7%;
    vertical-align: middle;
    cursor: pointer;
`

const PhoneTableTh = styled.th`
    font-weight: 500;
    margin-left: 5%;
    font-size: 17px;
    padding: 14px 20px;
    width: 12%;
}
`
const EmailTableTh = styled.th`
    font-weight: 500;    
    margin-left: 4%;
    font-size: 17px;
    padding: 14px 30px;
    width: 13%;
    margin-right: 4%;
}
`

const TbRowData = styled.tr`
    display: flex;
    border-radius: 12px 12px 4px 4px;
`

const BodyTable = styled.tbody`
    display: flex;
    border-radius: 0px 11px;
    justify-content: space-around;
    flex-direction: column;
    background: var(--dark-200, #F3F3F3);`

const TableTdCheck = styled.td`
    padding: 12px 12px;
    width: 1%;
`
const TableTd = styled.td`
    padding: 12px 12px;
    width: 20%;
`
const TableTdCPF = styled.td`
    padding: 12px 12px;
    width: 20%;
`

const TableTdIcon = styled.td`
    padding: 12px 12px;
    width: 10%;
`
const CheckBox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: none;
  background-color: #BABABA;
  border-radius: 4px;
  outline: none;
  cursor: pointer;

 &:checked{
    background-color: #EF6F2B; /* Cor de fundo do checkbox quando marcado */
    background-image: url('../../assets/dashboard/Icon.png');
    background-size: cover; /* Ajuste o tamanho do ícone conforme necessário */
    border: none;
}
`
const AlertSpace = styled.div`
    position: absolute;
    left: 74%;
    display: flex;
    align-items: flex-start;
    gap: 12px;
`