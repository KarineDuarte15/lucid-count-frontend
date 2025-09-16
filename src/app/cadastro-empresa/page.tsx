// src/app/cadastro-empresa/page.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 

import { 
    getUploadOptions, 
    criarEmpresa, 
    uploadDocumentos, 
    DocumentosExigidos, 
    EmpresaData
} from '../../service/api';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface DocumentoUpload {
  tipo: string;
  arquivo: File | null;
}
interface InscricaoEstadual {
  inscricao: string; data: string; uf: string;
}
interface Contato {
  nome: string; cargo: string; celular: string; email: string;
}

const estadoInicialEmpresa: EmpresaData = {
  cnpj: '', regime_tributario: '', razao_social: '', nome_fantasia: '', ativa: true,
  grupo_empresas: 'Geral', apelido_continuo: '', 
  endereco: { logradouro: '', numero: '', complemento: '', cep: '', bairro: '', cidade: '', uf: '' },
  inscricoes_estaduais: [{ inscricao: '', data: '', uf: 'CE' }],
  nire: '', fones: [], website: '', inscricao_municipal: '',
  contatos: [{ nome: '', cargo: '', celular: '', email: '' }],
};

export default function CadastroEmpresaPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresaData, setEmpresaData] = useState<EmpresaData>(estadoInicialEmpresa);
  const [fonesInput, setFonesInput] = useState('');
  const [documentos, setDocumentos] = useState<DocumentoUpload[]>([]);
  const [opcoesUpload, setOpcoesUpload] = useState<DocumentosExigidos>({});
  const [regimesDisponiveis, setRegimesDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    const buscarOpcoes = async () => {
      try {
        const data = await getUploadOptions();
        const regimes = Object.keys(data);
        setOpcoesUpload(data);
        setRegimesDisponiveis(regimes);
        if (regimes.length > 0) {
          setEmpresaData(prev => ({ ...prev, regime_tributario: regimes[0] }));
        }
      } catch (err) { // CORRIGIDO: Removido o tipo ': any'
        console.error(err);
        setError("Não foi possível carregar as opções de regimes.");
      }
    };
    buscarOpcoes();
  }, []);

  useEffect(() => {
    const regime = empresaData.regime_tributario;
    if (regime && opcoesUpload[regime]) {
      const docs = opcoesUpload[regime].map(tipo => ({ tipo, arquivo: null }));
      setDocumentos(docs);
    }
  }, [empresaData.regime_tributario, opcoesUpload]);
  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEmpresaData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmpresaData(prev => ({ ...prev, endereco: { ...(prev.endereco || {}), [name]: value } }));
  };

  const handleDynamicListChange = (index: number, event: ChangeEvent<HTMLInputElement>, listName: 'inscricoes_estaduais' | 'contatos') => {
    const { name, value } = event.target;
    const list = empresaData[listName] as (InscricaoEstadual[] | Contato[]);
    const newList = [...list];
    newList[index] = { ...newList[index], [name]: value };
    setEmpresaData(prev => ({ ...prev, [listName]: newList }));
  };

  const handleAddInscricao = () => setEmpresaData(prev => ({ ...prev, inscricoes_estaduais: [...(prev.inscricoes_estaduais || []), { inscricao: '', data: '', uf: 'CE' }] }));
  const handleRemoveInscricao = (index: number) => setEmpresaData(prev => ({ ...prev, inscricoes_estaduais: (prev.inscricoes_estaduais || []).filter((_, i) => i !== index) }));
  const handleAddContato = () => setEmpresaData(prev => ({ ...prev, contatos: [...(prev.contatos || []), { nome: '', cargo: '', celular: '', email: '' }] }));
  const handleRemoveContato = (index: number) => setEmpresaData(prev => ({ ...prev, contatos: (prev.contatos || []).filter((_, i) => i !== index) }));
  const handleFileChange = (index: number, file: File | null) => setDocumentos(docs => docs.map((d, i) => i === index ? {...d, arquivo: file} : d));

  const handleContinuarParaRevisao = () => {
    if (!empresaData.cnpj || !empresaData.regime_tributario) {
      setError("CNPJ e Regime Tributário são obrigatórios.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleConfirmarCadastro = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dataParaEnviar: EmpresaData = {
        ...empresaData,
        fones: fonesInput.split(',').map(f => f.trim()).filter(f => f)
      };
      await criarEmpresa(dataParaEnviar);
      const documentosParaUpload = documentos.filter(d => d.arquivo).map(d => ({ tipo: d.tipo, arquivo: d.arquivo as File }));
      if (documentosParaUpload.length > 0) {
        await uploadDocumentos(empresaData.cnpj, empresaData.regime_tributario, documentosParaUpload);
      }
      alert('Empresa cadastrada com sucesso!');
      router.push('/dashboard');
    } catch (err) { // ✅ CORREÇÃO: Removido o ": any"
       console.error(err);
       let errorDetail = "Ocorreu um erro ao criar a empresa.";

       // Verificamos se o erro é do Axios para acessar os detalhes com segurança
       if (axios.isAxiosError(err) && err.response) {
           const responseDetail = err.response.data?.detail;
           errorDetail = typeof responseDetail === 'string' 
               ? responseDetail 
               : JSON.stringify(responseDetail);
       }
       
       setError(errorDetail);
       setStep(1);
    }
  };

  return (
    <main className="min-h-screen flex bg-gray-100">
        <div className="w-1/4 bg-border flex flex-col items-center justify-between p-8 text-white">
            <Image src="/login-background1.png" alt="Lucid Count Logo" width={200} height={200} />
            <button onClick={() => step === 1 ? router.push('/dashboard') : setStep(1)} className="w-full text-center py-3 bg-background text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors">
            {step === 1 ? 'VOLTAR AO DASHBOARD' : 'VOLTAR E EDITAR'}
            </button>
        </div>
        
        <div className="w-3/4 p-10 overflow-y-auto">
            <div className="w-full max-w-6xl mx-auto">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            
            {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); handleContinuarParaRevisao(); }}>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Nova Empresa</h1>
                <div className="space-y-6">
                    {/* ... O JSX do formulário que você já tem ... */}
                    {/* (Colei o JSX completo da versão anterior para garantir) */}
                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <div className="lg:col-span-2"><label className="block text-sm font-medium text-gray-700">CNPJ</label><div className="flex"><input type="text" name="cnpj" value={empresaData.cnpj} onChange={handleInputChange} className="flex-1 p-2 border rounded-l-md" /><button type="button" className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700">Buscar</button></div></div>
                            <div><label className="block text-sm font-medium text-gray-700">Regime Tributário</label><select name="regime_tributario" value={empresaData.regime_tributario} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white">{regimesDisponiveis.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                            <div className="lg:col-span-2"><label className="block text-sm font-medium text-gray-700">Grupo de Empresas</label><input type="text" name="grupo_empresas" value={empresaData.grupo_empresas} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">ID Empresa</label><input type="text" placeholder="Automático" disabled className="w-full p-2 border rounded-md bg-gray-100" /></div>
                            <div className="lg:col-span-3"><label className="block text-sm font-medium text-gray-700">Razão Social</label><input type="text" name="razao_social" value={empresaData.razao_social} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Ativa?</label><select value={empresaData.ativa ? 'Sim' : 'Não'} onChange={e => setEmpresaData(prev => ({...prev, ativa: e.target.value === 'Sim'}))} className="w-full p-2 border rounded-md bg-white"><option>Sim</option><option>Não</option></select></div>
                            <div className="lg:col-span-2"><label className="block text-sm font-medium text-gray-700">Nome Fantasia</label><input type="text" name="nome_fantasia" value={empresaData.nome_fantasia} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-4"><label className="text-sm font-semibold text-gray-500">Endereço</label></div>
                            <div className="md:col-span-3"><input type="text" placeholder="Endereço" name="logradouro" value={empresaData.endereco?.logradouro} onChange={handleEnderecoChange} className="w-full p-2 border rounded-md" /></div>
                            <div><input type="text" placeholder="Número" name="numero" value={empresaData.endereco?.numero} onChange={handleEnderecoChange} className="w-full p-2 border rounded-md" /></div>
                            <div><input type="text" placeholder="Complemento" name="complemento" value={empresaData.endereco?.complemento} onChange={handleEnderecoChange} className="w-full p-2 border rounded-md" /></div>
                            <div><input type="text" placeholder="CEP" name="cep" value={empresaData.endereco?.cep} onChange={handleEnderecoChange} className="w-full p-2 border rounded-md" /></div>
                            <div><input type="text" placeholder="Bairro" name="bairro" value={empresaData.endereco?.bairro} onChange={handleEnderecoChange} className="w-full p-2 border rounded-md" /></div>
                            <div className="flex gap-2"><input type="text" placeholder="Cidade" name="cidade" value={empresaData.endereco?.cidade} onChange={handleEnderecoChange} className="flex-1 p-2 border rounded-md" /><input type="text" placeholder="UF" name="uf" value={empresaData.endereco?.uf} onChange={handleEnderecoChange} className="w-16 p-2 border rounded-md" /></div>
                            <div className="md:col-span-4"><label className="text-sm font-semibold text-gray-500 mt-4 block">Contato</label></div>
                            <div><input type="text" placeholder="Fone(s) (separados por vírgula)" value={fonesInput} onChange={e => setFonesInput(e.target.value)} className="w-full p-2 border rounded-md" /></div>
                            <div className="md:col-span-2"><input type="text" placeholder="Website da empresa" name="website" value={empresaData.website} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                        </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">Inscrições Estaduais</h3>
                                {(empresaData.inscricoes_estaduais || []).map((insc, index) => (
                                    <div key={index} className="grid grid-cols-5 gap-2 items-center">
                                        <input type="text" placeholder="Inscrição Estadual" name="inscricao" value={insc.inscricao} onChange={e => handleDynamicListChange(index, e, 'inscricoes_estaduais')} className="col-span-2 p-2 border rounded-md" />
                                        <input type="date" name="data" value={insc.data} onChange={e => handleDynamicListChange(index, e, 'inscricoes_estaduais')} className="p-2 border rounded-md" />
                                        <input type="text" placeholder="UF" name="uf" value={insc.uf} onChange={e => handleDynamicListChange(index, e, 'inscricoes_estaduais')} className="p-2 border rounded-md" />
                                        {empresaData.inscricoes_estaduais && empresaData.inscricoes_estaduais.length > 1 && <button type="button" onClick={() => handleRemoveInscricao(index)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>}
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddInscricao} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-2"><FaPlus /> Adicionar Inscrição</button>
                            </div>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700">NIRE</label><input type="text" name="nire" value={empresaData.nire} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Insc. Municipal</label><input type="text" name="inscricao_municipal" value={empresaData.inscricao_municipal} onChange={handleInputChange} className="w-full p-2 border rounded-md" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Contatos na Empresa</h3>
                        {(empresaData.contatos || []).map((contato, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 items-center">
                            <input type="text" placeholder="Nome" name="nome" value={contato.nome} onChange={e => handleDynamicListChange(index, e, 'contatos')} className="md:col-span-2 p-2 border rounded-md" />
                            <input type="text" placeholder="Cargo" name="cargo" value={contato.cargo} onChange={e => handleDynamicListChange(index, e, 'contatos')} className="p-2 border rounded-md" />
                            <input type="text" placeholder="Celular" name="celular" value={contato.celular} onChange={e => handleDynamicListChange(index, e, 'contatos')} className="p-2 border rounded-md" />
                            <div className="flex items-center gap-2">
                            <input type="email" placeholder="E-Mail" name="email" value={contato.email} onChange={e => handleDynamicListChange(index, e, 'contatos')} className="flex-1 p-2 border rounded-md" />
                            {empresaData.contatos && empresaData.contatos.length > 1 && <button type="button" onClick={() => handleRemoveContato(index)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>}
                            </div>
                        </div>
                        ))}
                        <button type="button" onClick={handleAddContato} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-2"><FaPlus /> Adicionar Contato</button>
                    </div>

                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Documentos Fiscais</h3>
                        <div className="space-y-3">{documentos.map((doc, index) => (<div key={index} className="flex items-center gap-4"><div className="flex-1 p-2 border rounded-md bg-gray-100">{doc.tipo}</div><label className="flex-1 p-2 border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-gray-50"><span className={doc.arquivo ? 'text-green-600 font-semibold' : 'text-gray-500'}>{doc.arquivo ? doc.arquivo.name : 'ADICIONAR DOCUMENTO'}</span><input type="file" className="hidden" onChange={e => handleFileChange(index, e.target.files ? e.target.files[0] : null)} /></label></div>))}</div>
                    </div>
                    
                    <div className="mt-8">
                        <button type="submit" disabled={isLoading} className="w-full py-3 bg-border text-white font-bold rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">CONTINUAR PARA REVISÃO</button>
                    </div>
                </div>
                </form>
            )}

            {step === 2 && (
                <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Revisão do Cadastro</h2>
                <div className="p-4 border rounded-lg bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Dados da Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
                    <p><strong>CNPJ:</strong> {empresaData.cnpj}</p>
                    <p><strong>Razão Social:</strong> {empresaData.razao_social || 'N/A'}</p>
                    <p><strong>Nome Fantasia:</strong> {empresaData.nome_fantasia || 'N/A'}</p>
                    <p><strong>Regime Tributário:</strong> {empresaData.regime_tributario}</p>
                    <p><strong>Ativa:</strong> {empresaData.ativa ? 'Sim' : 'Não'}</p>
                    </div>
                </div>

                <div className="p-4 border rounded-lg bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Documentos Selecionados</h3>
                    <ul>
                    {documentos.filter(d => d.arquivo).map((doc, i) => ( <li key={i} className="text-gray-700">{doc.tipo}: <span className="font-medium">{doc.arquivo?.name}</span></li>))}
                    {documentos.filter(d => d.arquivo).length === 0 && <p className="text-gray-500">Nenhum documento selecionado.</p>}
                    </ul>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => setStep(1)} disabled={isLoading} className="py-2 px-6 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600">Voltar e Editar</button>
                    <button onClick={handleConfirmarCadastro} disabled={isLoading} className="py-2 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">{isLoading ? 'ENVIANDO...' : 'Confirmar e Salvar'}</button>
                </div>
                </div>
            )}
            </div>
        </div>
    </main>
  );
}