import React, {useState, useEffect} from 'react';
import { BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs';
import axios from 'axios';
import styled from "styled-components";
import ModalAddFuncionario from '../modals/AddWorker';

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
    const [selections, setSelections] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Adiciona uma classe ao elemento body quando o modal é aberto
        if (isModalOpen) {
          document.body.classList.add('modal-open');
        } else {
          // Remove a classe quando o modal é fechado
          document.body.classList.remove('modal-open');
        }
    
        // Certifique-se de remover a classe ao desmontar o componente para evitar vazamentos
        return () => {
          document.body.classList.remove('modal-open');
        };
      }, [isModalOpen]);

    const openModal = () => {
        setIsModalOpen(true);
        
        return 0;
    };
  
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCheckboxChange = (event:any, id:number) => {
        const Cheked = event.target.checked;
        if(Cheked) {
            setIsChecked(true);
            // @ts-ignore
            setSelections([...selections, id]);
            setCount(count + 1);
        } else {
            // @ts-ignore
            const updatedSelections = selections.filter(data => data !== id);
            setSelections(updatedSelections);
            setCount(count - 1);
        }
    }

    useEffect(() => {        
        const authToken = localStorage.getItem('token'); // Substitua com o token real
        const config = {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          };

        axios.get('http://18.117.195.42/funcionarios', config)
                .then(response => {
                    setFuncionarios(response.data)
                })
                .catch(error => {
                    console.error('Erro na solicitação: ', error);
                    
                })
    }, [])
  
  return (
    <>
        <NavSelection>
            <NavSelectionTitle>
                Lista de funcionários
            </NavSelectionTitle>
            <NavSelectionButton onClick={openModal}>Adicionar novo</NavSelectionButton>
            <ModalAddFuncionario isOpen={isModalOpen} onClose={closeModal}/>
            <Selection>
                <Selected>Selecionados({count})</Selected>
                <DeleteSelection >Apagar Seleção</DeleteSelection>
            </Selection>
        </NavSelection>
        <Table>
            <HeadTable>
                <TbRow>
                    <EmptyTableTh></EmptyTableTh>
                    <NameTableTh>Nome completo</NameTableTh>
                    <CPFTableTh>CPF/CNPJ</CPFTableTh>
                    <PhoneTableTh>Celular</PhoneTableTh>
                    <EmailTableTh>E-mail</EmailTableTh>
                    <TableTh>Editar</TableTh>
                    <TableTh>Apagar</TableTh>
                </TbRow>
            </HeadTable>
            <BodyTable>
                {funcionarios.map((data) => (
                <TbRowData key={data.id}>
                    <TableTdCheck><CheckBox type="checkbox" name="" id="" checked={selections.includes(data.id)} onChange={e => handleCheckboxChange(e, data.id)}/></TableTdCheck>
                    <TableTd>{data.nome}</TableTd>
                    <TableTd>{(data.cpf) ? data.cpf : data.cnpj}</TableTd>
                    <TableTd>{data.celular}</TableTd>
                    <TableTd>{data.email}</TableTd>
                    <TableTdIcon><BsFillPencilFill size={20} /></TableTdIcon>
                    <TableTdIcon><BsFillTrashFill size={20} id="trash"/></TableTdIcon>
                </TbRowData> 
                ))}
            </BodyTable>
        </Table>
    </>
  );
}

const NavSelection = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    align-self: stretch;
`
const NavSelectionTitle = styled.h1`
    color: var(--dark-500, #1B1B1B);

    font-family: Manrope;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 23.5px; /* 117.5% */
    letter-spacing: -0.4px;
`
const NavSelectionButton = styled.button`
    display: flex;
    padding: 12px 16px;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    background: var(--primary-500, #EF6F2B);

    color: var(--base-branco, #FFF);
    text-align: center;

    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 19.5px; /* 139.286% */
    letter-spacing: -0.2px;
`

const Selection = styled.div`
    display: flex;
    padding-left: 42%
`

const Selected = styled.h1`
    color: #1B1B1B;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 18.8px; /* 117.5% */
    letter-spacing: -0.4px;
`

const DeleteSelection = styled.button`
    padding: 12px 16px;
    color: #767676;
    text-align: center;

    /* Button1 */
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 19.5px; /* 150% */
    letter-spacing: -0.2px;
    margin-left: 1%;
    width: 145px;

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
    padding-right: 2%
`

const TableTh = styled.th`
    font-size: 16px;
    padding: 14px 0px;
    width: 12%;
}

`
const NameTableTh = styled.th`
    font-size: 16px;
    padding: 14px 25px;
    width: 15%;
}
`

const CPFTableTh = styled.th`
    margin-left: 4%;
    font-size: 16px;
    padding: 14px 20px;
    width: 12%;
    gap: 10px;
}`

const PhoneTableTh = styled.th`
    margin-left: 5%;
    font-size: 16px;
    padding: 14px 20px;
    width: 12%;
}
`
const EmailTableTh = styled.th`
    margin-left: 4%;
    font-size: 16px;
    padding: 14px 30px;
    width: 13%;
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
    background: #BABABA;
`

const TableTdCheck = styled.td`
    padding: 12px 12px;
    width: 1%;
`
const TableTd = styled.td`
    padding: 12px 12px;
    width: 20%;
`
const TableTdIcon = styled.td`
    padding: 12px 12px;
    width: 10%;
`
const CheckBox = styled.input`
    backgroung-color: #BABABA;
    display: flex;
    align-items: left;
`
