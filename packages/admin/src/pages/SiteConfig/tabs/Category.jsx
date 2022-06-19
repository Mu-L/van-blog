import { createCategory, deleteCategory, updateCategory } from '@/services/van-blog/api';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import { useRef } from 'react';
import { useModel } from 'umi';
const columns = [
  {
    dataIndex: 'name',
    title: '题目',
    search: false,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: 200,
    render: (text, record, _, action) => [
      <ModalForm
        title={`修改分类 "${record.name}"`}
        trigger={<a key={'edit' + record.name}>修改</a>}
        autoFocusFirstInput
        submitTimeout={3000}
        onFinish={async (values) => {
          Modal.confirm({
            content: `确定修改分类 "${record.name}" 为 "${values.newName}" 吗？所有该分类下的文章都将被更新!`,
            onOk: async () => {
              await updateCategory(record.name, values.newName);
              message.success('提交成功');
              action?.reload();
              return true;
            },
          });

          return true;
        }}
      >
        <ProFormText
          width="md"
          name="newName"
          label="新分类名"
          placeholder="请输入新的分类名称"
          required
          rules={[{ required: true, message: '这是必填项' }]}
        />
      </ModalForm>,

      <a
        key={'deleteCategory' + record.name}
        onClick={() => {
          Modal.confirm({
            title: `确定删除分类 "${record.name}"吗？`,
            onOk: async () => {
              try {
                await deleteCategory(record.name);
                message.success('删除成功!');
              } catch {}
              action?.reload();
            },
          });
          // action?.startEditable?.(record.id);
        }}
      >
        删除
      </a>,
    ],
  },
];
export default function () {
  const { initialState, setInitialState } = useModel('@@initialState');
  const actionRef = useRef();
  return (
    <>
      <ProTable
        // dataSource={tableListDataSource}
        rowKey="key"
        // pagination={{
        //   showQuickJumper: true,
        // }}
        columns={columns}
        search={false}
        dateFormatter="string"
        headerTitle="分类"
        actionRef={actionRef}
        toolBarRender={() => [
          <ModalForm
            title="新建分类"
            key="newCategory"
            trigger={
              <Button key="button" icon={<PlusOutlined />} type="primary">
                新建分类
              </Button>
            }
            width={450}
            autoFocusFirstInput
            submitTimeout={3000}
            onFinish={async (values) => {
              const res = await createCategory(values);
              actionRef?.current?.reload();
              return true;
            }}
            layout="horizontal"
            labelCol={{ span: 6 }}
            // wrapperCol: { span: 14 },
          >
            <ProFormText
              width="md"
              required
              id="nameC"
              name="name"
              label="分类名称"
              placeholder="请输入分类名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ModalForm>,
        ]}
        request={async () => {
          let data = await initialState?.fetchInitData?.();
          await setInitialState((s) => ({ ...s, ...data }));
          data = data.categories.map((item) => ({
            key: item,
            name: item,
          }));
          console.log(data);
          return {
            data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: data.length,
          };
        }}
      />
    </>
  );
}