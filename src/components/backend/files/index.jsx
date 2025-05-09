import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FileDataService from '../../../services/files';
import FileUpload from './components/FileUpload';
import FileTable from './components/FileTable';
import DesignUpload from './components/DesignUpload';
import DesignTable from './components/DesignTable';
import SearchBar from './components/SearchBar';
import './Files.css';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [previewFileUrls, setPreviewFileUrls] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filesPerPage, setFilesPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [designs, setDesigns] = useState([]);
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [previewDesignUrls, setPreviewDesignUrls] = useState({});
  const [designName, setDesignName] = useState('');
  const [designUrl, setDesignUrl] = useState('');
  const [designCustomer, setDesignCustomer] = useState('');
  const [designContext, setDesignContext] = useState('');
  const [showFullContext, setShowFullContext] = useState(false);
  const [selectedDesignFile, setSelectedDesignFile] = useState(null);
  const [designsPerPage, setDesignsPerPage] = useState(5);
  const [currentDesignsPage, setCurrentDesignsPage] = useState(1);
  const [designNameSearch, setDesignNameSearch] = useState('');
  const [creatorSearch, setCreatorSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [contextSearch, setContextSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const token = useSelector(state => state.authentication.token);
  const NotallowedFileNames = ['First', 'SERVICES_3', 'SERVICES_1', 'SERVICES_2', 'Third', 'Second', 'Background Header', 'Video Summary', 'CPT3', 'CPT3XL', 'Compact', 'Tabletop', 'PLD_3D', '3Dpads', 'PCB', 'MultiScale', 'Sensor', 'Fringes', 'Chips'];

  const fetchCurrentUserData = () => {
    const currentUser = localStorage.getItem('currentUser');
    setCurrentUser(JSON.parse(currentUser));
  };

  const fetchFiles = () => {
    FileDataService.getAll(token)
      .then(response => {
        setFiles(response.data);
        const urls = {};
        response.data.forEach(file => {
          urls[file.id] = file.file;
        });
        setPreviewFileUrls(urls);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const fetchDesigns = () => {
    FileDataService.getAllDesigns(token)
      .then(response => {
        setDesigns(response.data);
        const urls = {};
        response.data.forEach(design => {
          urls[design.id] = design.file;
        });
        setPreviewDesignUrls(urls);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchCurrentUserData();
    fetchFiles();
    fetchDesigns();
  }, []);

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <Container className="py-8 px-4 sm:px-6 lg:px-8" style={{marginTop:"5%"}}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Archivos de ABCupon</h1>
        </motion.div>

        {currentUser && currentUser.staff_status === 'administrator' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6 mb-8"
          >
            <FileUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              fileName={fileName}
              setFileName={setFileName}
              selectedFileName={selectedFileName}
              setSelectedFileName={setSelectedFileName}
              files={files}
              fetchFiles={fetchFiles}
              token={token}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            filesPerPage={filesPerPage}
            setFilesPerPage={setFilesPerPage}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            setCurrentPage={setCurrentPage}
            setCurrentDesignsPage={setCurrentDesignsPage}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <FileTable
            files={files}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            previewFileUrls={previewFileUrls}
            searchTerm={searchTerm}
            startDate={startDate}
            endDate={endDate}
            filesPerPage={filesPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            token={token}
            fetchFiles={fetchFiles}
            currentUser={currentUser}
            NotallowedFileNames={NotallowedFileNames}
          />
        </motion.div>

        {currentUser && (currentUser.staff_status === 'administrator' || currentUser.staff_status === 'design') && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800">Archivos de Diseño</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-white shadow-lg rounded-lg p-6 mb-8"
            >
              <DesignUpload
                selectedDesignFile={selectedDesignFile}
                setSelectedDesignFile={setSelectedDesignFile}
                designName={designName}
                setDesignName={setDesignName}
                designUrl={designUrl}
                setDesignUrl={setDesignUrl}
                designCustomer={designCustomer}
                setDesignCustomer={setDesignCustomer}
                designContext={designContext}
                setDesignContext={setDesignContext}
                fetchDesigns={fetchDesigns}
                token={token}
                selectedDesigns={selectedDesigns}
                setSelectedDesigns={setSelectedDesigns}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-white shadow-lg rounded-lg p-6 mb-8"
            >
              <SearchBar
                searchTerm={designNameSearch}
                setSearchTerm={setDesignNameSearch}
                creatorSearch={creatorSearch}
                setCreatorSearch={setCreatorSearch}
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                contextSearch={contextSearch}
                setContextSearch={setContextSearch}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                filesPerPage={designsPerPage}
                setFilesPerPage={setDesignsPerPage}
                setCurrentPage={setCurrentDesignsPage}
                setCurrentDesignsPage={setCurrentDesignsPage}
                isDesignSearch
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <DesignTable
                designs={designs}
                selectedDesigns={selectedDesigns}
                setSelectedDesigns={setSelectedDesigns}
                previewDesignUrls={previewDesignUrls}
                designNameSearch={designNameSearch}
                creatorSearch={creatorSearch}
                customerSearch={customerSearch}
                contextSearch={contextSearch}
                startDate={startDate}
                endDate={endDate}
                designsPerPage={designsPerPage}
                currentDesignsPage={currentDesignsPage}
                setCurrentDesignsPage={setCurrentDesignsPage}
                token={token}
                fetchDesigns={fetchDesigns}
                currentUser={currentUser}
                showFullContext={showFullContext}
                setShowFullContext={setShowFullContext}
                NotallowedFileNames={NotallowedFileNames}
              />
            </motion.div>
          </>
        )}
      </Container>
    </>
  );
};

export default Files;