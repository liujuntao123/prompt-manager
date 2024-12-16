# PromptManager

一个简洁、美观、实用的提示词管理网站。


## 特性

- 简洁美观的界面设计
- 完全开源，可以自行部署和修改
- 支持提示词标签
- 支持提示词版本管理
- 移动端适配
- 简化的登录系统，使用毫无压力

## 技术栈

- Next.js 14
- Tailwind CSS
- Lucide
- Shadcn/UI
- 数据库：Supabase
- 用户认证：Clerk

## 部署流程

### vercel

1. fork本项目
2. 注册并登录vercel
3. 点击`New Project`
4. 选择`Import Git Repository`
5. 输入项目名称，选择`GitHub`作为代码来源
6. 点击`Deploy`

#### 环境变量说明

- `SUPABASE_URL`：Supabase的Project URL
- `SUPABASE_ANON_KEY`：Supabase的anon public或者service_role secret
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`：Clerk的Publishable Key
- `CLERK_SECRET_KEY`：Clerk的Secret Keys default

### supabase

#### 操作步骤

1. 注册supabase账号
2. 在 [项目界面](https://supabase.com/dashboard/projects) 新建项目，输入数据库密码，选择区域后继续
3. 在项目主页可以看到Project API项的Project URL以及anon public，复制后填入vercel的环境变量中（如果要用anon public需要注意关闭数据库表的行级安全）
4. 接下来创建数据库表，有两个建表语句，复制之后到SQL Editor界面依次执行
  ```
  CREATE TABLE prompts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    "content" text NOT NULL,
    description text NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    is_public bool NULL,
    user_id text NULL,
    "version" text NULL,
    tags text NULL,
    cover_img text NULL,
    CONSTRAINT prompts_pkey PRIMARY KEY (id)
  );
  ```
  ```
  CREATE TABLE tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    CONSTRAINT tags_name_key UNIQUE (name),
    CONSTRAINT tags_pkey PRIMARY KEY (id)
  );
  ```
5. 注意如果使用anon public，需要到Table Editor界面选择表后依次关闭RLS

#### EF图

![image](https://github.com/user-attachments/assets/326cf0f3-fc01-4c7a-a9a5-3c7b3a0c1da6)

### Clerk

1. 注册Clerk账号
2. 创建一个Application，初次创建的development环境，建议切换为production环境后使用，production环境要求必须自定义域名可选主要应用或次要应用，如果换域名请重新获取Publishable Key以及Secret Keys default
3. 在Configure界面的API Keys获取Publishable Key以及Secret Keys default后，复制填入vercel的环境变量中
4. 关闭注册等设置请自行设置如Restrictions中设置
