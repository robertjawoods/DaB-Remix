import { Title, Table as MantineTable } from "@mantine/core";

interface TableProps { 
    title: string; 
    rowHeaders: string[]
    rowGenerator: () => JSX.Element[]
}

export const Table = ({ title, rowHeaders, rowGenerator }: TableProps) => {
    return (
        <>
            <Title order={1}>{title}</Title>
            <MantineTable>
                <thead>
                    <tr>
                        {
                            rowHeaders.map((header) => <th>{header}</th>)
                        }
                    </tr>
                </thead>
                <tbody>{rowGenerator()}</tbody>
            </MantineTable>
        </>
    )
}