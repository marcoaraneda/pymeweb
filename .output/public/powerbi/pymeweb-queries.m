// Power BI (M) queries for Pymeweb analytics
// Update the parameters below before loading in Power BI Desktop.

let
    ApiBase = "http://127.0.0.1:8000/api",
    StoreSlug = "tu-tienda",
    Token = "PEGAR_TOKEN_AQUI",
    StartDate = "2026-01-01",
    EndDate = "2026-12-31",

    Headers = [Authorization = "Bearer " & Token],

    Orders = Csv.Document(
        Web.Contents(ApiBase & "/store/" & StoreSlug & "/admin/reportes/orders/export/?start_date=" & StartDate & "&end_date=" & EndDate, [Headers = Headers]),
        [Delimiter=",", Columns=10, Encoding=65001, QuoteStyle=QuoteStyle.None]
    ),

    OrderItems = Csv.Document(
        Web.Contents(ApiBase & "/store/" & StoreSlug & "/admin/reportes/orders/items/export/?start_date=" & StartDate & "&end_date=" & EndDate, [Headers = Headers]),
        [Delimiter=",", Columns=11, Encoding=65001, QuoteStyle=QuoteStyle.None]
    ),

    Products = Csv.Document(
        Web.Contents(ApiBase & "/store/" & StoreSlug & "/admin/reportes/products/export/?start_date=" & StartDate & "&end_date=" & EndDate, [Headers = Headers]),
        [Delimiter=",", Columns=4, Encoding=65001, QuoteStyle=QuoteStyle.None]
    ),

    Payments = Csv.Document(
        Web.Contents(ApiBase & "/store/" & StoreSlug & "/admin/reportes/payments/export/?start_date=" & StartDate & "&end_date=" & EndDate, [Headers = Headers]),
        [Delimiter=",", Columns=12, Encoding=65001, QuoteStyle=QuoteStyle.None]
    ),

    Customers = Csv.Document(
        Web.Contents(ApiBase & "/store/" & StoreSlug & "/admin/reportes/customers/export/?start_date=" & StartDate & "&end_date=" & EndDate, [Headers = Headers]),
        [Delimiter=",", Columns=6, Encoding=65001, QuoteStyle=QuoteStyle.None]
    )

in
    [Orders=Orders, OrderItems=OrderItems, Products=Products, Payments=Payments, Customers=Customers]
