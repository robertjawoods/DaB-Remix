import { format } from "date-fns"

const formatDate = (dateString: Date | string | null) => { 
    if (!dateString)
        return "Never"

    return format(new Date(dateString), "PPPppp")
}

export {formatDate}