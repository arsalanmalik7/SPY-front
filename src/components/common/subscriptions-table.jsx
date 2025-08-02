import { useEffect } from "react";
import axiosInstance from "../../services/axiosConfig";
export default function SubscriptionTable({ transactions }) {



    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-trbackground">

                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider ">
                            User
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Plan
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider ">
                            Status
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider ">
                            Date
                        </th>

                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.length > 0 ?
                        <> {transactions.map((transaction) => (
                            <tr key={transaction?.id} className="hover:bg-hover">

                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-gray-200 flex-shrink-0 mr-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-gray-900">{transaction?.billing_details?.name || "-"}</div>
                                            <div className="text-sm text-gray-500">{transaction?.billing_details?.email || "-"}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {transaction?.current_subscription?.plan}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {transaction?.amount ? `$${transaction?.amount / 100}` : '-'}
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {transaction?.role || '-'}
                                </td>

                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {transaction.created
                                        ? new Date(transaction.created * 1000).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            timeZone: 'UTC',   // ⚠️ Ensure UTC display
                                        })
                                        : 'Never'}
                                </td>


                            </tr>
                        ))}
                        </>
                        :
                        <tr className="hover:bg-hover">
                            <td className="px-4 py-4 text-center text-sm font-medium text-gray-800" colSpan="5">No data found</td>
                        </tr>
                    }
                </tbody>
            </table>

            <div className="px-4 py-3 flex flex-wrap items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">Showing 1 to {transactions.length} of {transactions.length} entries</div>
                <div className="flex flex-wrap items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">
                        Previous
                    </button>
                    <button className="px-3 py-1 rounded-md text-sm bg-textcolor text-white">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">Next</button>
                </div>
            </div>
        </div>
    )
}
