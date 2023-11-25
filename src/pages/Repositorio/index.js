import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from './styles';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function Repositorio() {
    const { id } = useParams();

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false},
    ]);
    const [filterIndex, setFilterIndex] = useState(0);

    useEffect(()=>{
        async function getDados(){
            const nomeRepo = decodeURIComponent(id);
            
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: filters.find(f => f.active).state,
                        per_page: 5,
                    }
                })
            ]);

            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }
        getDados();
    }, [id]);    

    useEffect(()=>{
        async function loadIssues(){
            const nomeRepo = decodeURIComponent(id);

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5,
                }
            });

            setIssues(response.data);
        }
        loadIssues();
    }, [filterIndex, filters, id, page]);

    if(loading){
        return (
            <Loading>
                Carregando...
            </Loading>
        )
    }

    function handlePage(action){
        setPage(action === 'back' ? page - 1 : page + 1);
    }

    function handleFilter(index){
        setFilterIndex(index);
    }

    return(
        <Container style={{color: '#FFF'}}>
            {decodeURIComponent(id)}
            <BackButton>
                <Link to="/">
                    <FaArrowLeft color="#000" size={30} />
                </Link>
            </BackButton>
            <Owner>
                <img 
                    src={repositorio.owner.avatar_url} 
                    alt={repositorio.owner.login} 
                />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>

            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button 
                        type="button" 
                        key={filter.label}
                        onClick={() => handleFilter(index)}
                    >
                        {filter.label}
                    </button>
                ))}
            </FilterList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img 
                            src={issue.user.avatar_url} 
                            alt={issue.user.login} 
                        />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>
                                        {label.name}
                                    </span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageActions>
                <button 
                    type="button" 
                    onClick={() => handlePage('back')}
                    disabled={page < 2}
                >
                    Voltar
                </button>
                <button type="button" onClick={() => handlePage('next')}>
                    Proximo
                </button>
            </PageActions>
        </Container>
    )
};