import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  arquivoUpado: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ arquivoUpado }) => {

  const [urlArquivoSelecionado, setUrlArquivoSelecionado] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    
    const arquivo = acceptedFiles[0];
    const arquivoUrl = URL.createObjectURL(arquivo);

    setUrlArquivoSelecionado(arquivoUrl);
    arquivoUpado(arquivo);
    
  }, [arquivoUpado])
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      { urlArquivoSelecionado
        ? <img src={urlArquivoSelecionado} alt="Imagem ilustrativa"/>
        : (
          <p>
            <FiUpload />
            Imagem do estabelecimento
          </p>
        )
      }
        
    </div>
  )
}

export default Dropzone;