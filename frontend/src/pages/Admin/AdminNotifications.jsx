import React, { useEffect, useState } from "react";
import Toggle from "../../components/Toggle";
import InputLabel from "../../components/InputLabel";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import api from "../../http";
import { toast } from "react-toastify";

const AdminNotifications = () => {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      contactEmail: "",
      telegramChatId: "",
      emailAll: true,
      emailCategories: [
        {
          id: "purchaseE",
          label: "Receive notifications about purchases",
          checked: true,
        },
        {
          id: "bidsE",
          label: "Receive notifications about new auction bids",
          checked: true,
        },
        {
          id: "endE",
          label: "Receive notifications when an auction ends",
          checked: true,
        },
      ],
      telegramAll: true,
      telegramCategories: [
        {
          id: "purchaseT",
          label: "Receive notifications about purchases",
          checked: true,
        },
        {
          id: "bidsT",
          label: "Receive notifications about new auction bids",
          checked: true,
        },
        {
          id: "endT",
          label: "Receive notifications when an auction ends",
          checked: true,
        },
      ],
    },
  });

  const [originalData, setOriginalData] = useState(null);
  const formData = watch();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get("/settings");
        if (data) {
          const formattedData = {
            contactEmail: data.contactEmail || "",
            telegramChatId: data.telegramChatId || "",
            emailAll: data.emailNotifications?.all || false,
            emailCategories: data.emailNotifications?.categories || [],
            telegramAll: data.telegramNotifications?.all || false,
            telegramCategories: data.telegramNotifications?.categories || [],
          };

          setOriginalData(formattedData);
          reset(formattedData);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const allEmailChecked = formData.emailCategories.every((cat) => cat.checked);
    if (formData.emailAll !== allEmailChecked) setValue("emailAll", allEmailChecked);
  }, [formData.emailCategories, formData.emailAll]);

  useEffect(() => {
    const allTelegramChecked = formData.telegramCategories.every((cat) => cat.checked);
    if (formData.telegramAll !== allTelegramChecked) setValue("telegramAll", allTelegramChecked);
  }, [formData.telegramCategories, formData.telegramAll]);

  const isDataChanged =
    originalData && JSON.stringify(originalData) !== JSON.stringify(formData);

  const handleToggleAll = (fieldName, categoriesField, checked) => {
    setValue(fieldName, checked);
    setValue(
      categoriesField,
      formData[categoriesField].map((cat) => ({ ...cat, checked }))
    );
  };

  const onSubmit = async (data) => {
    try {
      await toast.promise(
        api.put("/settings", {
          contactEmail: data.contactEmail,
          telegramChatId: data.telegramChatId,
          emailNotifications: {
            all: data.emailAll,
            categories: data.emailCategories,
          },
          telegramNotifications: {
            all: data.telegramAll,
            categories: data.telegramCategories,
          },
        }),
        {
          pending: "Updating notifications...",
          success: "Updated Successfully!",
          error: "Failed to update :/",
        }
      );
      setOriginalData(data);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin page | Notifications</title>
      </Helmet>
      <div className="w-[100vw] h-full">
        <div className="w-full h-full relative mt-[calc(52px+40px)] xl:mt-[calc(65px+40px)] px-[16px] xl:px-[6.25rem] pb-28">
          <div className="flex items-center justify-center w-full h-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full sm:max-w-[547px] flex flex-col gap-8"
            >
              <h2 className="font-main text-4xl font-[600]">Notifications</h2>

              <div className="flex flex-col gap-10">
                {/* Email Notifications */}
                <div className="flex flex-col gap-6">
                  <Controller
                    name="emailAll"
                    control={control}
                    render={({ field }) => (
                      <Toggle
                        id="emailAll"
                        bolder
                        label="All Email Notifications:"
                        checked={field.value}
                        onChange={() =>
                          handleToggleAll(
                            "emailAll",
                            "emailCategories",
                            !field.value
                          )
                        }
                      />
                    )}
                  />
                  <div className="flex flex-col gap-4 ml-3">
                    {formData.emailCategories.map((cat, index) => (
                      <Controller
                        key={cat.id}
                        name={`emailCategories.${index}.checked`}
                        control={control}
                        render={({ field }) => (
                          <Toggle
                            id={cat.id}
                            label={cat.label}
                            checked={field.value}
                            secondary
                            onChange={(e) => {
                              const updatedCategories = [
                                ...formData.emailCategories,
                              ];
                              updatedCategories[index].checked =
                                e.target.checked;
                              setValue("emailCategories", updatedCategories);
                            }}
                          />
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Telegram Notifications */}
                <div className="flex flex-col gap-6">
                  <Controller
                    name="telegramAll"
                    control={control}
                    render={({ field }) => (
                      <Toggle
                        id="telegramAll"
                        label="All Telegram Notifications:"
                        bolder
                        checked={field.value}
                        onChange={() =>
                          handleToggleAll(
                            "telegramAll",
                            "telegramCategories",
                            !field.value
                          )
                        }
                      />
                    )}
                  />
                  <div className="flex flex-col gap-4 ml-3">
                    {formData.telegramCategories.map((cat, index) => (
                      <Controller
                        key={cat.id}
                        name={`telegramCategories.${index}.checked`}
                        control={control}
                        render={({ field }) => (
                          <Toggle
                            id={cat.id}
                            label={cat.label}
                            checked={field.value}
                            secondary
                            onChange={(e) => {
                              const updatedCategories = [
                                ...formData.telegramCategories,
                              ];
                              updatedCategories[index].checked =
                                e.target.checked;
                              setValue("telegramCategories", updatedCategories);
                            }}
                          />
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Email & Telegram Settings */}
                <div className="flex flex-col gap-6 mt-2">
                  <Controller
                    name="contactEmail"
                    control={control}
                    render={({ field }) => (
                      <InputLabel
                        label="Current email"
                        id="currMail"
                        type="email"
                        placeholder="Current Email"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="telegramChatId"
                    control={control}
                    render={({ field }) => (
                      <InputLabel
                        label="Current Telegram channel"
                        id="currTelegram"
                        type="text"
                        placeholder="Current Telegram Channel @"
                        {...field}
                      />
                    )}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className={`flex font-main rounded-[1.25rem] w-full h-[44px] ${
                    isDataChanged
                      ? "bg-[#FCCB00] text-[#522700] hover:bg-[#D4A900] hover:text-[#1C1600]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } font-[600] items-center justify-center transition-colors duration-250`}
                  disabled={!isDataChanged} // Disable if data is unchanged
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AdminNotifications;
