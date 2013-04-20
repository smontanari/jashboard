require 'spec_helper'
require 'ipsum'
require 'plugins/ipsum/ipsum_plugin'

module Jashboard
  module Plugin
    module Ipsum
      describe IpsumPlugin do
        context("Runtime info: generating sentences") do
          before(:each) do
            class ::Fixnum
              alias_method :original_sentences, :sentences
              def sentences(language)
                "#{self} sentences in #{language.inspect}"
              end
            end
          end
          after(:each) do
            class ::Fixnum
              alias_method :sentences, :original_sentences
              remove_method :original_sentences
            end
          end

          it("should return sentences in french") do
            monitor_configuration = Struct.new(:number_of_sentences, :language).new(10, "french")
            runtime_info = subject.get_runtime_info(monitor_configuration)
            runtime_info.text.should == "10 sentences in :french"
          end
          it("should return sentences in english") do
            monitor_configuration = Struct.new(:number_of_sentences, :language).new(5, "english")
            runtime_info = subject.get_runtime_info(monitor_configuration)
            runtime_info.text.should == "5 sentences in :english"
          end
        end
      end
    end
  end
end
