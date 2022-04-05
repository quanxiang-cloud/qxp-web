import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Artery } from '@one-for-all/artery';

import { parseJSON } from '@lib/utils';
import { useGetGlobalConfig } from '@lib/configuration-center';

import PageEngine from './page-engine';
import SelectCustomPageEditor from './select-custom-page-editor';
import SchemaEditor from './schema-editor';
import { getPage } from './api';
import {
  getKeyOfCustomPageEditor,
  CUSTOM_PAGE_EDITOR_SCHEMA,
  CUSTOM_PAGE_EDITOR_PAGE_ENGINE,
  initialSchema,
} from './utils';
import './index.scss';

export function useCustomPageSchema(appID: string, pageId: string): { loading: boolean; schema?: Artery } {
  const { isLoading, data } = useQuery<Artery | undefined>(
    ['check_has_custom_page_schema', appID, pageId],
    () => {
      return getPage(appID, pageId).then((schema) => {
        if (!schema) {
          return;
        }

        return parseJSON(schema, undefined);
      });
    },
  );

  return { loading: isLoading, schema: data };
}

function useWhichCustomPageEditor(appID: string, pageId: string): { editor: string; loading: boolean; } {
  const [key, newKey] = getKeyOfCustomPageEditor(appID, pageId);
  const [editor, loading] = useGetGlobalConfig(key, '1.0.0', '');
  const [newEditor, newLoading] = useGetGlobalConfig(newKey, '1.0.0', '');
  return { editor: newEditor || editor, loading: newLoading || loading };
}

function PageDesign(): JSX.Element | null {
  const { appID, pageId } = useParams<{appID: string; pageId: string}>();
  const { schema, loading: hasSchemaLoading } = useCustomPageSchema(appID, pageId);
  const { editor, loading: editorLoading } = useWhichCustomPageEditor(appID, pageId);
  const [selectedEditor, setSelectedEditor] = useState('');

  // todo refactor this
  if (selectedEditor === CUSTOM_PAGE_EDITOR_SCHEMA) {
    return (<SchemaEditor appID={appID} pageId={pageId} initialSchema={schema || initialSchema} />);
  }

  // todo refactor this
  if (selectedEditor === CUSTOM_PAGE_EDITOR_PAGE_ENGINE) {
    return (<PageEngine />);
  }

  if (hasSchemaLoading || editorLoading) {
    return null;
  }

  if (!schema) {
    return (<SelectCustomPageEditor appID={appID} pageId={pageId} onSelect={setSelectedEditor} />);
  }

  if (editor === CUSTOM_PAGE_EDITOR_SCHEMA) {
    return (<SchemaEditor appID={appID} pageId={pageId} initialSchema={schema} />);
  }

  return (<PageEngine />);
}

export default PageDesign;
