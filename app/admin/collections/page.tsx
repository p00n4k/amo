'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  message,
  Typography,
  Image,
  Popconfirm,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import axios from 'axios';
import styles from './page.module.css';

const { Title } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const formatTypeLabel = (type: string) => {
  if (type === 'Furniture') return 'Funishing';
  if (type === 'Other') return 'Others';
  return type;
};

interface Collection {
  collection_id: number;
  collection_name: string;
  type: 'Surface' | 'Furniture' | 'Other';
  brand_id: number; // ✅ important (API needs brand_id)
  brand_name: string;
  material_type: string;
  status: boolean;
  description: string;
  image: string;
  link: string;
  relate_link: string;
  created_at?: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface SearchFilters {
  collection_name: string;
  material_type: string;
  brand_name: string;
  type: '' | 'Surface' | 'Furniture' | 'Other';
}

const EMPTY_SEARCH_FILTERS: SearchFilters = {
  collection_name: '',
  material_type: '',
  brand_name: '',
  type: '',
};

export default function CollectionsPage() {
  // ✅ use ONE endpoint for CRUD (matches your route.ts)
  const API = '/api/admin/collection';

  const { data, error, mutate } = useSWR<Collection[]>(API, fetcher);
  const { data: brandData } = useSWR<Brand[]>('/api/admin/brand', fetcher);

  const collections: Collection[] = Array.isArray(data) ? data : [];
  const brands: Brand[] = Array.isArray(brandData)
    ? [...brandData].sort((a, b) => a.brand_name.localeCompare(b.brand_name))
    : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form] = Form.useForm();

  const [uploading, setUploading] = useState(false);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>(EMPTY_SEARCH_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(EMPTY_SEARCH_FILTERS);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const topScrollbarRef = useRef<HTMLDivElement>(null);
  const topScrollbarInnerRef = useRef<HTMLDivElement>(null);

  const handleApplySearch = () => {
    setAppliedFilters({
      collection_name: searchFilters.collection_name.trim().toLowerCase(),
      material_type: searchFilters.material_type.trim().toLowerCase(),
      brand_name: searchFilters.brand_name.trim().toLowerCase(),
      type: searchFilters.type,
    });
  };

  const handleResetSearch = () => {
    setSearchFilters(EMPTY_SEARCH_FILTERS);
    setAppliedFilters(EMPTY_SEARCH_FILTERS);
  };

  useEffect(() => {
    const tableContent = tableContainerRef.current?.querySelector('.ant-table-content') as HTMLDivElement | null;
    const topScrollbar = topScrollbarRef.current;
    const topScrollbarInner = topScrollbarInnerRef.current;

    if (!tableContent || !topScrollbar || !topScrollbarInner) return;

    let syncing = false;

    const syncTopWidth = () => {
      topScrollbarInner.style.width = `${tableContent.scrollWidth}px`;
    };

    const onTopScroll = () => {
      if (syncing) return;
      syncing = true;
      tableContent.scrollLeft = topScrollbar.scrollLeft;
      syncing = false;
    };

    const onBottomScroll = () => {
      if (syncing) return;
      syncing = true;
      topScrollbar.scrollLeft = tableContent.scrollLeft;
      syncing = false;
    };

    syncTopWidth();
    topScrollbar.scrollLeft = tableContent.scrollLeft;

    topScrollbar.addEventListener('scroll', onTopScroll);
    tableContent.addEventListener('scroll', onBottomScroll);

    const resizeObserver = new ResizeObserver(syncTopWidth);
    resizeObserver.observe(tableContent);
    window.addEventListener('resize', syncTopWidth);

    return () => {
      topScrollbar.removeEventListener('scroll', onTopScroll);
      tableContent.removeEventListener('scroll', onBottomScroll);
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncTopWidth);
    };
  }, [collections.length]);

  // ✅ Upload image to /api/admin/upload
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploading(false);
      return res.data.filePath as string;
    } catch (e) {
      console.error(e);
      setUploading(false);
      message.error('Upload failed!');
      return '';
    }
  };

  const showModal = (record?: Collection) => {
    if (record) {
      setEditing(record);
      // ✅ make sure form uses brand_id, not brand_name
      form.setFieldsValue({
        ...record,
        brand_id: record.brand_id,
      });
    } else {
      setEditing(null);
      form.resetFields();
      form.setFieldsValue({
        status: true,
        type: 'Surface',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await axios.put(API, {
          collection_id: editing.collection_id,
          ...values,
        });
        message.success('Collection updated!');
      } else {
        await axios.post(API, values);
        message.success('Collection created!');
      }

      mutate();
      setIsModalOpen(false);
      form.resetFields();
    } catch (e) {
      console.error(e);
      message.error('Save failed!');
    }
  };

  const handleDelete = async (collection_id: number) => {
    try {
      await axios.delete(API, { data: { collection_id } });
      message.success('Deleted!');
      mutate();
    } catch (e) {
      console.error(e);
      message.error('Delete failed!');
    }
  };

  const filteredCollections = useMemo(() => {
    const hasAnyFilter = Object.values(appliedFilters).some(Boolean);
    if (!hasAnyFilter) return collections;

    const includesFilter = (fieldValue: string, filterValue: string) => {
      if (!filterValue) return true;
      return String(fieldValue || '').toLowerCase().includes(filterValue);
    };

    return collections.filter((item) => {
      return (
        includesFilter(item.collection_name, appliedFilters.collection_name) &&
        includesFilter(item.material_type, appliedFilters.material_type) &&
        includesFilter(item.brand_name, appliedFilters.brand_name) &&
        includesFilter(item.type, appliedFilters.type.toLowerCase())
      );
    });
  }, [collections, appliedFilters]);

  // quick filters from data
  const brandFilters = useMemo(() => {
    const uniq = Array.from(new Set(collections.map((c) => c.brand_name).filter(Boolean))).sort();
    return uniq.map((b) => ({ text: b, value: b }));
  }, [collections]);

  const materialFilters = useMemo(() => {
    const uniq = Array.from(new Set(collections.map((c) => c.material_type).filter(Boolean))).sort();
    return uniq.map((m) => ({ text: m, value: m }));
  }, [collections]);

  const columns: ColumnsType<Collection> = [
    {
      title: 'ID',
      dataIndex: 'collection_id',
      key: 'collection_id',
      width: 80,
      sorter: (a, b) => a.collection_id - b.collection_id,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 110,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="collection"
            width={70}
            height={50}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: 'Collection',
      dataIndex: 'collection_name',
      key: 'collection_name',
    },
    {
      title: 'Brand',
      dataIndex: 'brand_name',
      key: 'brand_name',
      filters: brandFilters,
      onFilter: (value, record) => record.brand_name === value,
      sorter: (a, b) => (a.brand_name || '').localeCompare(b.brand_name || ''),
    },
    {
      title: 'Item',
      dataIndex: 'material_type',
      key: 'material_type',
      filters: materialFilters,
      onFilter: (value, record) => record.material_type === value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Surface', value: 'Surface' },
        { text: formatTypeLabel('Furniture'), value: 'Furniture' },
        { text: formatTypeLabel('Other'), value: 'Other' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (value: Collection['type']) => formatTypeLabel(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      filters: [
        { text: 'Active', value: '1' },
        { text: 'Inactive', value: '0' },
      ],
      onFilter: (value, record) => (record.status ? '1' : '0') === String(value),
      render: (val: boolean) => <Switch checked={!!val} disabled />,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      width: 200,
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" title={url}>
            {url.length > 17 ? url.substring(0, 17) + '...' : url}
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: 'Relate',
      dataIndex: 'relate_link',
      key: 'relate_link',
      width: 200,
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" title={url}>
            {url.length > 17 ? url.substring(0, 17) + '...' : url}
          </a>
        ) : (
          '-'
        ),
    },

    // ✅ Description = second last column (ก่อน Actions)
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 260,
    },

    // ✅ Actions = LAST column
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_: any, record: Collection) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Delete this collection?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.collection_id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) return <div>Failed to load</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Collections Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Collection
        </Button>
      </div>

      <div className={styles.searchToolbar}>
        <div className={styles.searchGrid}>
          <Input
            value={searchFilters.collection_name}
            onChange={(e) =>
              setSearchFilters((prev) => ({ ...prev, collection_name: e.target.value }))
            }
            onPressEnter={handleApplySearch}
            placeholder="Collection"
          />
          <Input
            value={searchFilters.material_type}
            onChange={(e) =>
              setSearchFilters((prev) => ({ ...prev, material_type: e.target.value }))
            }
            onPressEnter={handleApplySearch}
            placeholder="Item"
          />
          <Select
            showSearch
            allowClear
            value={searchFilters.brand_name || undefined}
            placeholder="Brand"
            optionFilterProp="label"
            options={brands.map((brand) => ({ label: brand.brand_name, value: brand.brand_name }))}
            onChange={(value) =>
              setSearchFilters((prev) => ({ ...prev, brand_name: value || '' }))
            }
          />
          <Select
            showSearch
            allowClear
            value={searchFilters.type || undefined}
            placeholder="Type"
            optionFilterProp="label"
            options={[
              { label: 'Surface', value: 'Surface' },
              { label: formatTypeLabel('Furniture'), value: 'Furniture' },
              { label: formatTypeLabel('Other'), value: 'Other' },
            ]}
            onChange={(value) =>
              setSearchFilters((prev) => ({ ...prev, type: (value || '') as SearchFilters['type'] }))
            }
          />
        </div>
        <div className={styles.searchActions}>
          <Button type="primary" size="large" icon={<SearchOutlined />} onClick={handleApplySearch}>
            Search
          </Button>
          <Button size="large" onClick={handleResetSearch}>
            Reset
          </Button>
        </div>
      </div>

      <div className={styles.tableScrollWrapper}>
        <div ref={topScrollbarRef} className={styles.topScrollbar}>
          <div ref={topScrollbarInnerRef} className={styles.topScrollbarInner} />
        </div>

        <div ref={tableContainerRef} className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={filteredCollections}
            rowKey="collection_id"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <Modal
        title={editing ? 'Edit Collection' : 'Add Collection'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Collection Collection"
            name="collection_name"
            rules={[{ required: true, message: 'Please input collection name!' }]}
          >
            <Input />
          </Form.Item>

          {/* ✅ IMPORTANT: use brand_id (number) */}
          <Form.Item label="Brand" name="brand_id" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" placeholder="Select brand">
              {brands.map((b) => (
                <Select.Option key={b.brand_id} value={b.brand_id} label={b.brand_name}>
                  {b.brand_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Item Type" name="material_type" rules={[{ required: true }]}>
            <Input placeholder="e.g., Porcelain, Ceramic, Wood" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Surface">Surface</Select.Option>
              <Select.Option value="Furniture">{formatTypeLabel('Furniture')}</Select.Option>
              <Select.Option value="Other">{formatTypeLabel('Other')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please upload image!' }]}>
            <Upload
              name="file"
              listType="picture"
              customRequest={async ({ file, onSuccess }) => {
                const path = await handleUpload(file as File);
                form.setFieldValue('image', path);
                onSuccess && onSuccess('ok');
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload Image
              </Button>
            </Upload>

            {form.getFieldValue('image') && (
              <Image
                src={form.getFieldValue('image')}
                alt="Preview"
                width={120}
                style={{ marginTop: 10, borderRadius: 4 }}
              />
            )}
          </Form.Item>

          <Form.Item label="Link" name="link">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Relate Link" name="relate_link">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}