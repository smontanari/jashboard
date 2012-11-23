require 'open-uri'
require 'nokogiri'
require 'extensions/jashboard_extensions'
require 'plugins/ci/ciserver_type_manager'
require 'plugins/ci/build_runtime_info'

module Jashboard
  module Plugin
    module CIServer
      JenkinsServerSettings = Struct.new(:hostname, :port, :build_id).tap do |clazz|
        clazz.module_eval do
          extend ServerSettings
          ciserver_type 1
        end
      end

      class JenkinsAdapter
        extend CIServerTypeManager
        is_ciserver_adapter_for_type 1

        def create_settings(input_settings)
          JenkinsServerSettings.new(input_settings['hostname'], input_settings['port'], input_settings['build_id'])
        end

        def fetch_build_runtime_info(settings)
          @base_url = "http://#{settings.hostname}:#{settings.port}/job/#{settings.build_id}"
          @doc = Nokogiri::XML(open("#{@base_url}/lastSuccessfulBuild/api/xml"))
          BuildRuntimeInfo.new(get_time, get_duration, get_result, get_current_status)
        end

        private

        def get_time
          seconds = @doc.at_css("timestamp").
                    text.
                    to_i / 1000
          Time.at(seconds).strftime("%d-%m-%Y %H:%M:%S")
        end

        def get_duration
          @doc.at_css("duration").
            text.
            to_i / 1000
        end

        def get_result
          @doc.at_css("result").text == "SUCCESS"
        end

        def get_current_status
          last_build_number = @doc.at_css("number").text.to_i
          status = nil
          begin
            open("#{@base_url}/#{last_build_number + 1}/api/xml")
            status = 1
          rescue OpenURI::HTTPError => error
            status = 0 if error.message.start_with? "404"
          rescue
          end
          status
        end
      end
    end
  end
end
