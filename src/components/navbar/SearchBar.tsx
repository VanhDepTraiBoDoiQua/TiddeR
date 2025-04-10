"use client"

import {FC, useCallback, useState} from 'react';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/Command";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {ExtendedCommunity} from "@/types/db";
import {useRouter} from "next/navigation";
import {Users} from "lucide-react";
import debounce from "lodash.debounce";

interface SearchBarProps {

}

const SearchBar: FC<SearchBarProps> = () => {

    const [input, setInput] = useState<string>("");

    const router = useRouter();

    const {data: queryResults, refetch, isFetching, isFetched} = useQuery({
        queryKey: ["search-query"],

        queryFn: async () => {
            if (!input) {
                return [];
            }

            const {data} = await axios.get(`/api/search?query=${encodeURIComponent(input)}`);
            return data as ExtendedCommunity[];
        },

        enabled: false,
    });

    const request = debounce(() => {
        refetch();
    }, 300);

    const debounceRequest = useCallback(() => {
        request();
    }, []);

    return (
        <Command className="relative rounded-lg border
            max-w-lg z-50 overflow-visible"
        >
            <CommandInput
                className="outline-none border-none focus:border-none
                    focus:outline-none ring-0"
                placeholder="Search communities..."
                value={input}
                onValueChange={(text) => {
                    setInput(text);
                    if (text.length >= 3) {
                        debounceRequest();
                    }
                }}
            />
            {input.length > 0 ? (
                <CommandList className="absolute bg-white top-full
                    inset-x-0 shadow rounded-b-md"
                >
                    {isFetched && input.length >= 3 &&
                        <CommandEmpty>
                            No results found.
                        </CommandEmpty>
                    }
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading="Communities">
                            {queryResults?.map((community) => (
                                <CommandItem
                                    onSelect={(e) => {
                                        router.push(`/t/${e}`);
                                        router.refresh();
                                    }}
                                    key={community.id}
                                    value={community.name}
                                >
                                    <Users className="mr-2 h-4 w-4"/>
                                    <a href={`/t/${community.name}`}>
                                        t/{community.name}
                                    </a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            ) : null}
        </Command>
    );
};

export default SearchBar;