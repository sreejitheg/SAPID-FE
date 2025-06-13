"use client";

import React, { useState } from 'react';
import { FileText, Upload, Trash2, AlertTriangle, ExternalLink, Shield } from 'lucide-react';
import { Document } from '../../types';
import { DocumentUpload } from '../Documents/DocumentUpload';

interface DocumentsTabProps {
  documents: Document[];
  onDocumentUpload: (file: File, type: 'permanent' | 'temporary') => Promise<void>;
  onDocumentDelete: (docId: string) => Promise<void>;
  isUploading: boolean;
  userRole: 'admin' | 'user';
  isMobile: boolean;
}

export function DocumentsTab({ 
  documents, 
  onDocumentUpload, 
  onDocumentDelete, 
  isUploading, 
  userRole,
  isMobile 
}: DocumentsTabProps) {
  const [showUpload, setShowUpload] = useState(false);
  
  const permanentDocs = documents.filter(doc => doc.type === 'permanent');
  const temporaryDocs = documents.filter(doc => doc.type === 'temporary');
  const showTempWarning = temporaryDocs.length >= 8;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {isMobile ? 'Session Files' : 'Documents'}
          </h2>
          {(userRole === 'admin' || isMobile) && (
            <button
              onClick={() => setShowUpload(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {showTempWarning && !isMobile && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-medium">Many temporary files</p>
              <p className="text-amber-700 dark:text-amber-400">Consider managing your uploads to improve performance.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!isMobile && userRole === 'admin' && permanentDocs.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Permanent Files</h3>
            </div>
            <div className="space-y-2">
              {permanentDocs.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  document={doc}
                  onDelete={onDocumentDelete}
                  formatFileSize={formatFileSize}
                  formatDate={formatDate}
                  canDelete={userRole === 'admin'}
                />
              ))}
            </div>
          </div>
        )}

        {temporaryDocs.length > 0 && (
          <div className={`p-4 ${!isMobile && userRole === 'admin' && permanentDocs.length > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {isMobile ? 'Uploaded Files' : 'Session Files'}
            </h3>
            <div className="space-y-2">
              {temporaryDocs.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  document={doc}
                  onDelete={onDocumentDelete}
                  formatFileSize={formatFileSize}
                  formatDate={formatDate}
                  canDelete={true}
                />
              ))}
            </div>
          </div>
        )}

        {documents.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">No documents uploaded</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {isMobile ? 'Upload files for this conversation' : 'Upload files to get started'}
            </p>
          </div>
        )}
      </div>

      {showUpload && (
        <DocumentUpload
          onUpload={onDocumentUpload}
          onClose={() => setShowUpload(false)}
          isUploading={isUploading}
          userRole={userRole}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

interface DocumentItemProps {
  document: Document;
  onDelete: (docId: string) => Promise<void>;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: Date) => string;
  canDelete: boolean;
}

function DocumentItem({ document, onDelete, formatFileSize, formatDate, canDelete }: DocumentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setIsDeleting(true);
      try {
        await onDelete(document.id);
      } catch (error) {
        console.error('Failed to delete document:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleView = () => {
    if (document.url) {
      window.open(document.url, '_blank');
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:shadow-sm dark:hover:shadow-gray-900/20 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {document.name}
            </span>
            {document.url && (
              <button
                onClick={handleView}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                title="View document"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatFileSize(document.size)}</span>
            <span>•</span>
            <span>{formatDate(document.uploadedAt)}</span>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              document.type === 'permanent'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
            }`}>
              {document.type === 'permanent' ? 'Permanent' : 'Session'}
            </span>
          </div>
        </div>
        
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-all duration-200"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}