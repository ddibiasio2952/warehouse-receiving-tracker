IF DB_ID(N'receiving_database') IS NULL
BEGIN
    CREATE DATABASE [receiving_database];
END;
GO

USE [receiving_database];
GO

SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

CREATE TABLE [dbo].[Suppliers] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](150) NOT NULL,
    CONSTRAINT [PK_Suppliers] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Suppliers_Name] UNIQUE NONCLUSTERED ([Name] ASC)
);
GO

CREATE TABLE [dbo].[Skus] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [SkuNumber] [nvarchar](50) NOT NULL,
    [Description] [nvarchar](255) NOT NULL,
    [SupplierId] [int] NOT NULL,
    CONSTRAINT [PK_Skus] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Skus_SkuNumber] UNIQUE NONCLUSTERED ([SkuNumber] ASC),
    CONSTRAINT [FK_Skus_Suppliers]
        FOREIGN KEY ([SupplierId])
        REFERENCES [dbo].[Suppliers] ([Id])
);
GO

CREATE TABLE [dbo].[PurchaseOrders] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Status] [nvarchar](20) NOT NULL,
    [ExpectedDate] [date] NOT NULL,
    [SupplierId] [int] NOT NULL,
    CONSTRAINT [PK_PurchaseOrders] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PurchaseOrders_Suppliers]
        FOREIGN KEY ([SupplierId])
        REFERENCES [dbo].[Suppliers] ([Id]),
    CONSTRAINT [CK_PurchaseOrders_Status]
        CHECK (
            [Status] = N'open'
            OR [Status] = N'received'
            OR [Status] = N'resolved'
            OR [Status] = N'closed'
        )
);
GO

CREATE TABLE [dbo].[PurchaseOrderLines] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [PurchaseOrderId] [int] NOT NULL,
    [SkuId] [int] NOT NULL,
    [ExpectedQuantity] [int] NOT NULL,
    [ReceivedQuantity] [int] NOT NULL
        CONSTRAINT [DF_PurchaseOrderLines_ReceivedQuantity] DEFAULT (0),
    [DamagedQuantity] [int] NOT NULL
        CONSTRAINT [DF_PurchaseOrderLines_DamagedQuantity] DEFAULT (0),
    [ReceiptRecorded] [bit] NOT NULL
        CONSTRAINT [DF_PurchaseOrderLines_ReceiptRecorded] DEFAULT (0),
    CONSTRAINT [PK_PurchaseOrderLines] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_PurchaseOrderLines_PurchaseOrders]
        FOREIGN KEY ([PurchaseOrderId])
        REFERENCES [dbo].[PurchaseOrders] ([Id]),
    CONSTRAINT [FK_PurchaseOrderLines_Skus]
        FOREIGN KEY ([SkuId])
        REFERENCES [dbo].[Skus] ([Id]),
    CONSTRAINT [CK_PurchaseOrderLines_ExpectedQuantity]
        CHECK ([ExpectedQuantity] > 0),
    CONSTRAINT [CK_PurchaseOrderLines_ReceivedQuantity]
        CHECK ([ReceivedQuantity] >= 0),
    CONSTRAINT [CK_PurchaseOrderLines_DamagedQuantity]
        CHECK ([DamagedQuantity] >= 0),
    CONSTRAINT [CK_PurchaseOrderLines_DamagedNotGreaterThanReceived]
        CHECK ([DamagedQuantity] <= [ReceivedQuantity])
);
GO

CREATE NONCLUSTERED INDEX [IX_Skus_SupplierId]
ON [dbo].[Skus] ([SupplierId]);
GO

CREATE NONCLUSTERED INDEX [IX_PurchaseOrders_SupplierId]
ON [dbo].[PurchaseOrders] ([SupplierId]);
GO

CREATE NONCLUSTERED INDEX [IX_PurchaseOrderLines_PurchaseOrderId]
ON [dbo].[PurchaseOrderLines] ([PurchaseOrderId]);
GO

CREATE NONCLUSTERED INDEX [IX_PurchaseOrderLines_SkuId]
ON [dbo].[PurchaseOrderLines] ([SkuId]);
GO
