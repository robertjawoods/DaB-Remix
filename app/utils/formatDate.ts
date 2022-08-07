import { format } from "date-fns"

const formatDate = (dateString: string | null) => { 
    if (!dateString)
        return "Never"

    return format(new Date(dateString), "PPPppp")
}

export {formatDate}